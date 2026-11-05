import { useCollection } from './useCollection'
import { prepareEnglish } from '../i18n/prepareEnglish'

const NEWS = { path: 'news', orderBy: [['featured', 'desc'], ['createdAt', 'desc']] }

// Las escrituras usan el SDK completo, que se carga recién acá (el sitio público nunca escribe)
const writes = () => import('../firebase/writes')

export async function createNews(data) {
    const { data: item, translated } = await prepareEnglish('news', data)
    const fs = await writes()
    await fs.addTo('news', {
        ...item,
        createdAt: fs.serverTimestamp(),
        updatedAt: fs.serverTimestamp(),
    })
    return { translated }
}

export async function updateNews(id, data) {
    const { data: changes, translated } = await prepareEnglish('news', data, ['news', id])
    await (await writes()).update(['news', id], changes)
    return { translated }
}

export async function deleteNews(id) {
    await (await writes()).remove(['news', id])
    return true
}

export function useNews({ realtime = true } = {}) {
    const { data: news, loading, error } = useCollection(NEWS, { realtime, label: 'news' })
    return { news, loading, error, createNews, updateNews, deleteNews }
}
