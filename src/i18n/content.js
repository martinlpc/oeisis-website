// Contenido cargado en el admin que se traduce al inglés.
// Se usa en la web, en el admin y en la edge function (por eso no importa nada de Firebase).
//
// Cada documento guarda:
//   en:     { 'description': '...', 'ctas[0].label': '...' }  traducción por campo
//   enHash: huella de los textos en español que se tradujeron
// Si el español cambia y la huella ya no coincide, la web en inglés muestra el español
// hasta que se vuelva a traducir: nunca se ve una traducción vieja.

// Solo textos libres. Títulos de shows, lugares, ciudades, álbumes y créditos quedan como están.
export const CONTENT_FIELDS = {
    shows: ['description'],
    news: ['title', 'content'],
    featured: ['title', 'description', { list: 'ctas', fields: ['label'] }],
    videos: ['title', 'description'],
    press: ['bioShort', 'bioLong', { list: 'facts', fields: ['label', 'value'] }],
}

const fieldName = (field) => (typeof field === 'string' ? field : field.list)

// ¿El cambio toca algún texto traducible?
export function touchesContent(collection, data) {
    return (CONTENT_FIELDS[collection] || []).some(field => fieldName(field) in (data || {}))
}

// { clave: texto en español } con los textos no vacíos del documento
export function sourceTexts(collection, doc) {
    const texts = {}
    for (const field of CONTENT_FIELDS[collection] || []) {
        if (typeof field === 'string') {
            const text = doc?.[field]
            if (typeof text === 'string' && text.trim()) texts[field] = text
            continue
        }
        ;(doc?.[field.list] || []).forEach((item, index) => {
            for (const sub of field.fields) {
                const text = item?.[sub]
                if (typeof text === 'string' && text.trim()) texts[`${field.list}[${index}].${sub}`] = text
            }
        })
    }
    return texts
}

// FNV-1a de 32 bits: alcanza para saber si el texto cambió
export function contentHash(texts) {
    const input = JSON.stringify(Object.entries(texts).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)))
    let hash = 0x811c9dc5
    for (let i = 0; i < input.length; i++) {
        hash ^= input.charCodeAt(i)
        hash = Math.imul(hash, 0x01000193)
    }
    return (hash >>> 0).toString(16).padStart(8, '0')
}

// 'current' (al día), 'stale' (el español cambió), 'missing' (nunca se tradujo) o 'empty' (no hay texto)
export function translationStatus(collection, doc) {
    const texts = sourceTexts(collection, doc)
    if (Object.keys(texts).length === 0) return 'empty'
    if (!doc?.en || !doc.enHash) return 'missing'
    return doc.enHash === contentHash(texts) ? 'current' : 'stale'
}

// Documento con los textos en inglés aplicados, si la traducción está al día
export function localize(collection, doc, lang) {
    if (lang !== 'en' || !doc || translationStatus(collection, doc) !== 'current') return doc
    const en = doc.en
    const out = { ...doc }
    for (const field of CONTENT_FIELDS[collection] || []) {
        if (typeof field === 'string') {
            if (en[field]) out[field] = en[field]
            continue
        }
        if (Array.isArray(doc[field.list])) {
            out[field.list] = doc[field.list].map((item, index) => {
                const copy = { ...item }
                for (const sub of field.fields) {
                    const text = en[`${field.list}[${index}].${sub}`]
                    if (text) copy[sub] = text
                }
                return copy
            })
        }
    }
    return out
}
