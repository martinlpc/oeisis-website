import { touchesContent, sourceTexts, contentHash } from './content'

// Antes de guardar en Firestore: agrega la traducción al inglés si cambió algún texto.
// - Si el español no cambió, no se traduce de nuevo (y se conservan las correcciones a mano).
// - Si falla la traducción, se guarda igual: la web en inglés muestra el español de ese documento
//   hasta que se traduzca desde Mantenimiento.
// path: ['shows', id] para un documento existente; sin path, es uno nuevo.
// Devuelve { data, translated }: translated es true, false (falló) o null (no hizo falta).
export async function prepareEnglish(collection, data, path) {
    if (!touchesContent(collection, data)) return { data, translated: null }

    let existing = {}
    if (path) {
        const { read } = await import('../firebase/writes')
        existing = (await read(path)) || {}
    }
    const texts = sourceTexts(collection, { ...existing, ...data })
    const enHash = contentHash(texts)
    if (existing.en && existing.enHash === enHash) return { data, translated: null }

    try {
        const { translateTexts } = await import('./translateContent')
        const en = await translateTexts(texts)
        return { data: { ...data, en, enHash }, translated: true }
    } catch (error) {
        console.error('No se pudo traducir al inglés:', error)
        return { data, translated: false }
    }
}
