import { collection, query, orderBy, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useCollection } from './useCollection'
import { prepareEnglish } from '../i18n/prepareEnglish'

const videosQuery = () => query(collection(db, 'videos'), orderBy('date', 'desc'))

export async function createVideo(data) {
    const { data: video, translated } = await prepareEnglish('videos', {
        title: data.title,
        description: data.description,
        embedUrl: data.embedUrl,
        date: data.date,
        featured: data.featured || false,
    })
    await addDoc(collection(db, 'videos'), video)
    return { translated }
}

export async function updateVideo(id, data) {
    const ref = doc(db, 'videos', id)
    const { data: changes, translated } = await prepareEnglish('videos', data, ref)
    await updateDoc(ref, changes)
    return { translated }
}

export async function deleteVideo(id) {
    await deleteDoc(doc(db, 'videos', id))
    return true
}

export function useVideos({ realtime = true } = {}) {
    const { data: videos, loading, error } = useCollection(videosQuery, { realtime, label: 'videos' })
    return { videos, loading, error, createVideo, updateVideo, deleteVideo }
}
