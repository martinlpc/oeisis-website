import { collection, query, orderBy, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useCollection } from './useCollection'
import { prepareEnglish } from '../i18n/prepareEnglish'

const newsQuery = () => query(
    collection(db, 'news'),
    orderBy('featured', 'desc'),
    orderBy('createdAt', 'desc')
)

export async function createNews(data) {
    const { data: item, translated } = await prepareEnglish('news', data)
    await addDoc(collection(db, 'news'), {
        ...item,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    })
    return { translated }
}

export async function updateNews(id, data) {
    const ref = doc(db, 'news', id)
    const { data: changes, translated } = await prepareEnglish('news', data, ref)
    await updateDoc(ref, changes)
    return { translated }
}

export async function deleteNews(id) {
    await deleteDoc(doc(db, 'news', id))
    return true
}

export function useNews({ realtime = true } = {}) {
    const { data: news, loading, error } = useCollection(newsQuery, { realtime, label: 'news' })
    return { news, loading, error, createNews, updateNews, deleteNews }
}
