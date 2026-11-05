import { collection, query, limit, doc, setDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useCollection } from './useCollection'
import { prepareEnglish } from '../i18n/prepareEnglish'

const featuredQuery = () => query(collection(db, 'featured'), limit(1))

export async function updateFeatured(data, id = 'current') {
    const ref = doc(db, 'featured', id)
    const { data: changes, translated } = await prepareEnglish('featured', data, ref)
    await setDoc(ref, changes, { merge: true })
    return { translated }
}

export function useFeatured({ realtime = true } = {}) {
    const { data, loading, error } = useCollection(featuredQuery, { realtime, label: 'featured' })
    return { featured: data[0] || null, loading, error, updateFeatured }
}
