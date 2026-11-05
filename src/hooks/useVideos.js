import { useCollection } from './useCollection'
import { prepareEnglish } from '../i18n/prepareEnglish'

const VIDEOS = { path: 'videos', orderBy: [['date', 'desc']] }

// Las escrituras usan el SDK completo, que se carga recién acá (el sitio público nunca escribe)
const writes = () => import('../firebase/writes')

export async function createVideo(data) {
    const { data: video, translated } = await prepareEnglish('videos', {
        title: data.title,
        description: data.description,
        embedUrl: data.embedUrl,
        date: data.date,
        featured: data.featured || false,
    })
    await (await writes()).addTo('videos', video)
    return { translated }
}

export async function updateVideo(id, data) {
    const { data: changes, translated } = await prepareEnglish('videos', data, ['videos', id])
    await (await writes()).update(['videos', id], changes)
    return { translated }
}

export async function deleteVideo(id) {
    await (await writes()).remove(['videos', id])
    return true
}

export function useVideos({ realtime = true } = {}) {
    const { data: videos, loading, error } = useCollection(VIDEOS, { realtime, label: 'videos' })
    return { videos, loading, error, createVideo, updateVideo, deleteVideo }
}
