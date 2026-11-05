// Solo admin: llama a la función de Netlify que traduce. Importa Firebase Auth,
// por eso se carga con import() y no entra en el bundle del sitio público.
import { auth } from '../firebase/auth'
import { sourceTexts, contentHash } from './content'

export async function translateTexts(texts) {
    if (Object.keys(texts).length === 0) return {}
    const user = auth.currentUser
    if (!user) throw new Error('Sesión vencida, volvé a entrar')
    const response = await fetch('/.netlify/functions/translate', {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${await user.getIdToken()}` },
        body: JSON.stringify({ texts }),
    })
    const data = await response.json().catch(() => null)
    if (!response.ok) throw new Error(data?.error || `HTTP ${response.status}`)
    return data.texts
}

// Campos en inglés para un documento: { en, enHash }
export async function translateDoc(collection, doc) {
    const texts = sourceTexts(collection, doc)
    return { en: await translateTexts(texts), enHash: contentHash(texts) }
}
