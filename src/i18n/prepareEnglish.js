import { getDoc } from 'firebase/firestore'
import { touchesContent, sourceTexts, contentHash } from './content'

// Antes de guardar en Firestore: agrega la traducción al inglés si cambió algún texto.
// - Si el español no cambió, no se traduce de nuevo (y se conservan las correcciones a mano).
// - Si falla la traducción, se guarda igual: la web en inglés muestra el español de ese documento
//   hasta que se traduzca desde Mantenimiento.
// Devuelve { data, translated }: translated es true, false (falló) o null (no hizo falta).
export async function prepareEnglish(collection, data, ref) {
    if (!touchesContent(collection, data)) return { data, translated: null }

    const existing = ref ? (await getDoc(ref)).data() || {} : {}
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
