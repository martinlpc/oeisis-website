import { useState } from 'react'
import { getEmbedUrl, getThumbnailUrl } from '../../utils/youtube'
import { useLang } from '../../i18n/lang'

// Muestra la miniatura y monta el iframe de YouTube recién al hacer click.
// Cada iframe carga ~500 KB-1 MB de JS, así que la home no los carga hasta que hacen falta.
export function YouTubeEmbed({ url, title, className = '' }) {
    const [active, setActive] = useState(false)
    const [lowRes, setLowRes] = useState(false)
    const { t } = useLang()
    const thumbnail = getThumbnailUrl(url, lowRes ? 'hqdefault' : 'maxresdefault')

    if (!thumbnail) return null

    if (active) {
        return (
            <iframe
                src={getEmbedUrl(url, { autoplay: true })}
                className={`w-full h-full ${className}`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        )
    }

    return (
        <button
            type="button"
            onClick={() => setActive(true)}
            className={`group relative w-full h-full bg-black ${className}`}
            aria-label={t('videos.play', { title })}
        >
            <img
                src={thumbnail}
                alt=""
                loading="lazy"
                // Si no hay maxres, YouTube devuelve un placeholder de 120x90 en vez de un 404
                onLoad={(e) => { if (e.currentTarget.naturalWidth <= 120) setLowRes(true) }}
                onError={() => setLowRes(true)}
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition"
            />
            <span className="absolute inset-0 flex items-center justify-center">
                <span className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-black/70 group-hover:bg-white flex items-center justify-center transition">
                    <svg viewBox="0 0 24 24" className="w-8 h-8 md:w-10 md:h-10 ml-1 fill-white group-hover:fill-black transition" aria-hidden="true">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                </span>
            </span>
        </button>
    )
}
