import { useCollection } from './useCollection'
import { prepareEnglish } from '../i18n/prepareEnglish'

const FEATURED = { path: 'featured', limit: 1 }

export async function updateFeatured(data, id = 'current') {
    const { data: changes, translated } = await prepareEnglish('featured', data, ['featured', id])
    const { set } = await import('../firebase/writes')
    await set(['featured', id], changes, { merge: true })
    return { translated }
}

export function useFeatured({ realtime = true } = {}) {
    const { data, loading, error } = useCollection(FEATURED, { realtime, label: 'featured' })
    return { featured: data[0] || null, loading, error, updateFeatured }
}
