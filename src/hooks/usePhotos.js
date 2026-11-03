import { collection, query, orderBy, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useCollection } from './useCollection'

const photosQuery = () => query(collection(db, 'photos'), orderBy('date', 'desc'))

export async function createPhoto(data) {
    await addDoc(collection(db, 'photos'), {
        title: data.title,
        imageUrl: data.imageUrl,
        date: data.date,
        album: data.album || '',
    })
    return true
}

export async function updatePhoto(id, data) {
    await updateDoc(doc(db, 'photos', id), data)
    return true
}

export async function deletePhoto(id) {
    await deleteDoc(doc(db, 'photos', id))
    return true
}

export function usePhotos({ realtime = true } = {}) {
    const { data: photos, loading, error } = useCollection(photosQuery, { realtime, label: 'photos' })
    return { photos, loading, error, createPhoto, updatePhoto, deletePhoto }
}
