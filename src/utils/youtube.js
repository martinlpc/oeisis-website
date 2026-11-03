// Acepta links de YouTube en cualquier formato:
// watch?v=, youtu.be/, embed/, shorts/, live/ y youtube-nocookie.com
export function getYouTubeId(url) {
    const match = String(url || '').match(
        /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/)|youtu\.be\/)([\w-]{11})/
    )
    return match ? match[1] : null
}

// Lee t= o start= ("1395", "1395s", "23m15s", "1h2m3s") y devuelve segundos
export function getStartSeconds(url) {
    const match = String(url || '').match(/[?&#](?:t|start)=([\dhms]+)/)
    if (!match) return 0
    const value = match[1]
    if (/^\d+s?$/.test(value)) return parseInt(value, 10)
    const h = value.match(/(\d+)h/)?.[1] || 0
    const m = value.match(/(\d+)m/)?.[1] || 0
    const s = value.match(/(\d+)s/)?.[1] || 0
    return Number(h) * 3600 + Number(m) * 60 + Number(s)
}

export function getEmbedUrl(url, { autoplay = false } = {}) {
    const id = getYouTubeId(url)
    if (!id) return null
    const params = new URLSearchParams({ rel: '0' })
    const start = getStartSeconds(url)
    if (start) params.set('start', String(start))
    if (autoplay) params.set('autoplay', '1')
    return `https://www.youtube-nocookie.com/embed/${id}?${params}`
}

// maxresdefault (1280x720) no existe en todos los videos; hqdefault (480x360) sí
export function getThumbnailUrl(url, quality = 'maxresdefault') {
    const id = getYouTubeId(url)
    return id ? `https://i.ytimg.com/vi/${id}/${quality}.jpg` : null
}
