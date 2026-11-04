// Lectura de Firestore por REST desde las edge functions (Deno).
// Usa la misma API key pública del sitio: las reglas permiten leer las colecciones públicas.

const env = (name) => globalThis.Netlify?.env.get(name)

function decodeValue(value) {
    if (!value) return null
    if ('stringValue' in value) return value.stringValue
    if ('booleanValue' in value) return value.booleanValue
    if ('integerValue' in value) return Number(value.integerValue)
    if ('doubleValue' in value) return value.doubleValue
    if ('timestampValue' in value) return value.timestampValue
    if ('nullValue' in value) return null
    if ('mapValue' in value) return decodeFields(value.mapValue.fields)
    if ('arrayValue' in value) return (value.arrayValue.values || []).map(decodeValue)
    return null
}

function decodeFields(fields = {}) {
    return Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, decodeValue(value)]))
}

function baseUrl() {
    const project = env('VITE_FIREBASE_PROJECT_ID')
    return project && `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents`
}

// Un documento como objeto plano, o null si no existe o falla
export async function getDocument(path) {
    const base = baseUrl()
    if (!base) return null
    try {
        const response = await fetch(`${base}/${path}?key=${env('VITE_FIREBASE_API_KEY')}`)
        if (!response.ok) return null
        const doc = await response.json()
        return { id: doc.name.split('/').pop(), updateTime: doc.updateTime, ...decodeFields(doc.fields) }
    } catch {
        return null
    }
}

// Todos los documentos de una colección (hasta 300)
export async function listDocuments(collection) {
    const base = baseUrl()
    if (!base) return []
    try {
        const response = await fetch(`${base}/${collection}?pageSize=300&key=${env('VITE_FIREBASE_API_KEY')}`)
        if (!response.ok) return []
        const data = await response.json()
        return (data.documents || []).map(doc => ({ id: doc.name.split('/').pop(), updateTime: doc.updateTime, ...decodeFields(doc.fields) }))
    } catch {
        return []
    }
}
