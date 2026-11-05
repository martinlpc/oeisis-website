import { useState } from "react"
import { InterviewThumbnail } from "./InterviewThumbnail"
import { Lightbox } from "../photos/Lightbox"
import { useLang } from "../../../i18n/lang"
import { localize } from "../../../i18n/content"
import { formatNewsDate } from "../../../i18n/dates"

// Textos más largos que esto se muestran recortados con "Leer más"
const LONG_CONTENT = 320

// Recorta por párrafos completos; si el primero ya es muy largo, corta en la última palabra
function previewText(content) {
    const paragraphs = content.split(/\n\s*\n/)
    let preview = paragraphs[0]
    for (const paragraph of paragraphs.slice(1)) {
        if ((preview + paragraph).length > LONG_CONTENT) break
        preview += '\n\n' + paragraph
    }
    if (preview.length > LONG_CONTENT) {
        preview = preview.slice(0, preview.lastIndexOf(' ', LONG_CONTENT))
    }
    return preview.trimEnd().replace(/[.,;:]+$/, '') + '…'
}

export function NewsArticle({ item: raw, renderContentWithLinks }) {
    const [expanded, setExpanded] = useState(false)
    const [openImage, setOpenImage] = useState(null)
    const { lang, t } = useLang()
    const item = localize('news', raw, lang)
    const date = formatNewsDate(item, lang)

    const content = item.content || ''
    const isLong = content.length > LONG_CONTENT
    const shownContent = isLong && !expanded ? previewText(content) : content
    const images = item.images || []
    const lightboxPhotos = images.map((url) => ({
        id: url,
        imageUrl: url,
        title: item.title,
        date,
    }))

    return (
        <article className="py-10 border-t border-white/10">
            {/* Tipo, fecha y destacado */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-3 text-xs uppercase tracking-widest text-gray-400">
                <span>{item.type === 'interview' ? t('news.interview') : t('news.item')}</span>
                <span aria-hidden="true">·</span>
                <span>{date}</span>
                {item.featured && (
                    <span className="border border-white text-white px-2 py-0.5">{t('news.featured')}</span>
                )}
            </div>

            <h3 className="text-2xl md:text-3xl font-bold mb-4">{item.title}</h3>

            {/* Contenido: respeta los saltos de línea que se cargan en el admin */}
            {content && (
                <div className="mb-6">
                    <p className="text-gray-300 leading-relaxed break-words whitespace-pre-line">
                        {renderContentWithLinks(shownContent)}
                    </p>
                    {isLong && (
                        <button
                            type="button"
                            onClick={() => setExpanded(e => !e)}
                            className="mt-2 text-sm font-semibold underline underline-offset-4 text-white hover:text-gray-300"
                            aria-expanded={expanded}
                        >
                            {expanded ? t('news.readLess') : t('news.readMore')}
                        </button>
                    )}
                </div>
            )}

            {/* Imágenes: abren el mismo visor que la galería */}
            {images.length > 0 && (
                <ul className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                    {images.map((imageUrl, index) => (
                        <li key={imageUrl}>
                            <button
                                type="button"
                                onClick={() => setOpenImage(index)}
                                className="block w-full aspect-[4/3] overflow-hidden rounded-lg group"
                                aria-label={t('news.viewImage', { n: index + 1, title: item.title })}
                            >
                                <img
                                    src={imageUrl}
                                    alt=""
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-full object-cover motion-safe:group-hover:scale-105 transition duration-300"
                                />
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {item.type === 'interview' && item.externalLink && (
                <InterviewThumbnail externalLink={item.externalLink} title={item.title} />
            )}

            {openImage !== null && (
                <Lightbox
                    photos={lightboxPhotos}
                    index={openImage}
                    onClose={() => setOpenImage(null)}
                    onChange={setOpenImage}
                />
            )}
        </article>
    )
}
