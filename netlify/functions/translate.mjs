// POST /.netlify/functions/translate: traduce al inglés los textos que carga el admin, con Google Cloud Translation.
// La key queda acá, del lado del servidor. Solo responde a un admin logueado (token de Firebase con role
// 'authenticated', el mismo claim que piden las reglas de Firestore), así nadie más gasta la cuota.
//
// Variables en Netlify: GOOGLE_TRANSLATE_API_KEY y VITE_FIREBASE_PROJECT_ID (con alcance Functions).
import { createRemoteJWKSet, jwtVerify } from 'jose'

const GOOGLE_KEYS = createRemoteJWKSet(
    new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'),
)

// Tope por pedido: una noticia larga son unos pocos miles de caracteres
const MAX_CHARS = 30000

// Nombres y datos que no se traducen nunca
const KEEP = /(https?:\/\/\S+|[\w.+-]+@[\w-]+\.[\w.]+|[@#][\w.]+|\bOeisis\b|\bOasis\b|\bGallagher\b|\bOurMusic Productions\b)/g

const json = (body, status = 200) => new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
})

const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Texto plano -> HTML para el traductor: protege nombres y links, y conserva los saltos de línea
export function toHtml(text) {
    return escapeHtml(text)
        .replace(KEEP, (match) => `<span translate="no">${match}</span>`)
        .replace(/\r?\n/g, '<br>')
}

export function fromHtml(html) {
    return html
        .replace(/\s*<br\s*\/?>\s?/gi, '\n')
        .replace(/<span translate="no">([\s\S]*?)<\/span>/g, '$1')
        .replace(/<[^>]+>/g, '')
        .replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
}

async function isAdmin(request, projectId) {
    const token = (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '')
    if (!token) return false
    try {
        const { payload } = await jwtVerify(token, GOOGLE_KEYS, {
            issuer: `https://securetoken.google.com/${projectId}`,
            audience: projectId,
        })
        return payload.role === 'authenticated'
    } catch {
        return false
    }
}

export default async (request) => {
    if (request.method !== 'POST') return json({ error: 'Método no permitido' }, 405)

    const projectId = process.env.VITE_FIREBASE_PROJECT_ID
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY
    if (!projectId || !apiKey) return json({ error: 'Falta configurar GOOGLE_TRANSLATE_API_KEY en Netlify' }, 500)

    if (!(await isAdmin(request, projectId))) return json({ error: 'No autorizado' }, 401)

    let texts
    try {
        texts = (await request.json()).texts
    } catch {
        return json({ error: 'Pedido inválido' }, 400)
    }
    const keys = Object.keys(texts || {})
    if (keys.length === 0) return json({ texts: {} })
    if (keys.some(key => typeof texts[key] !== 'string')) return json({ error: 'Pedido inválido' }, 400)
    if (keys.reduce((total, key) => total + texts[key].length, 0) > MAX_CHARS) return json({ error: 'Texto demasiado largo' }, 413)

    const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(apiKey)}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ q: keys.map(key => toHtml(texts[key])), source: 'es', target: 'en', format: 'html' }),
    })
    const data = await response.json().catch(() => null)
    if (!response.ok) {
        console.error('Google Translate', response.status, data?.error?.message)
        return json({ error: `El traductor respondió ${response.status}: ${data?.error?.message || 'sin detalle'}` }, 502)
    }

    const translations = data.data.translations
    return json({ texts: Object.fromEntries(keys.map((key, i) => [key, fromHtml(translations[i].translatedText)])) })
}
