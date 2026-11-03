import { collection, query, orderBy, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useCollection } from './useCollection'

const newsQuery = () => query(
    collection(db, 'news'),
    orderBy('featured', 'desc'),
    orderBy('createdAt', 'desc')
)

export async function createNews(data) {
    await addDoc(collection(db, 'news'), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    })
    return true
}

export async function updateNews(id, data) {
    await updateDoc(doc(db, 'news', id), data)
    return true
}

export async function deleteNews(id) {
    await deleteDoc(doc(db, 'news', id))
    return true
}

export function useNews({ realtime = true } = {}) {
    const { data: news, loading, error } = useCollection(newsQuery, { realtime, label: 'news' })
    return { news, loading, error, createNews, updateNews, deleteNews }
}
