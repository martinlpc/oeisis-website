import { collection, query, limit, doc, setDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useCollection } from './useCollection'

const featuredQuery = () => query(collection(db, 'featured'), limit(1))

export async function updateFeatured(data, id = 'current') {
    await setDoc(doc(db, 'featured', id), data, { merge: true })
    return true
}

export function useFeatured({ realtime = true } = {}) {
    const { data, loading, error } = useCollection(featuredQuery, { realtime, label: 'featured' })
    return { featured: data[0] || null, loading, error, updateFeatured }
}
