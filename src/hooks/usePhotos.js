import { useCollection } from './useCollection'

const PHOTOS = { path: 'photos', orderBy: [['date', 'desc']] }

// Las escrituras usan el SDK completo, que se carga recién acá (el sitio público nunca escribe)
const writes = () => import('../firebase/writes')

// thumbUrl: miniatura liviana para la grilla; imageUrl: la foto completa para el visor
export async function createPhoto(data) {
    await (await writes()).addTo('photos', {
        title: data.title,
        imageUrl: data.imageUrl,
        thumbUrl: data.thumbUrl || '',
        date: data.date,
        album: data.album || '',
    })
    return true
}

export async function updatePhoto(id, data) {
    await (await writes()).update(['photos', id], data)
    return true
}

export async function deletePhoto(id) {
    await (await writes()).remove(['photos', id])
    return true
}

export function usePhotos({ realtime = true } = {}) {
    const { data: photos, loading, error } = useCollection(PHOTOS, { realtime, label: 'photos' })
    return { photos, loading, error, createPhoto, updatePhoto, deletePhoto }
}
