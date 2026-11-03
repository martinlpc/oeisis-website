import { collection, query, orderBy, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useCollection } from './useCollection'

const videosQuery = () => query(collection(db, 'videos'), orderBy('date', 'desc'))

export async function createVideo(data) {
    await addDoc(collection(db, 'videos'), {
        title: data.title,
        description: data.description,
        embedUrl: data.embedUrl,
        date: data.date,
        featured: data.featured || false,
    })
    return true
}

export async function updateVideo(id, data) {
    await updateDoc(doc(db, 'videos', id), data)
    return true
}

export async function deleteVideo(id) {
    await deleteDoc(doc(db, 'videos', id))
    return true
}

export function useVideos({ realtime = true } = {}) {
    const { data: videos, loading, error } = useCollection(videosQuery, { realtime, label: 'videos' })
    return { videos, loading, error, createVideo, updateVideo, deleteVideo }
}
