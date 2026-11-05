import { useFeatured } from '../../../hooks/useFeatured'
import { SectionSkeleton } from '../SectionState'
import { useInView } from '../../../hooks/useInView'
import { YouTubeEmbed } from '../../common/YouTubeEmbed'
import { useLang } from '../../../i18n/lang'
import { localize } from '../../../i18n/content'

// Título de la sección según el tipo elegido en el admin
const SECTION_TITLES = ['show', 'video', 'news', 'custom']

export function Featured() {
    const { featured: raw, loading, error } = useFeatured({ realtime: false })
    const [ref, isInView] = useInView()
    const { lang, t } = useLang()
    const featured = localize('featured', raw, lang)

    if (loading) {
        return <SectionSkeleton className='bg-[#141414]' count={1} fullHeight={false} />
    }

    // El error queda en consola; si falla, la sección simplemente no se muestra
    if (error || !featured) {
        return null
    }

    const isVideo = featured.type === 'video' && featured.videoUrl
    const ctas = featured.ctas || []

    return (
        <section
            id='featured-section'
            ref={ref}
            className={`bg-[#141414] text-white py-20 md:py-28 px-4 md:px-6 transition-opacity duration-1000 ${isInView ? 'opacity-100' : 'opacity-0'}`}
        >
            {/* Media a la izquierda y texto a la derecha. La imagen se limita por alto y por ancho:
                un flyer vertical queda angosto y uno horizontal llega hasta el 60% del ancho,
                sin recortes y sin esperar a medir la imagen. */}
            <div className='max-w-6xl mx-auto flex flex-col md:flex-row md:items-center gap-10 md:gap-14'>
                {isVideo ? (
                    <div className='w-full md:w-3/5 shrink-0 aspect-video'>
                        <YouTubeEmbed url={featured.videoUrl} title={featured.title} />
                    </div>
                ) : featured.image ? (
                    <img
                        src={featured.image}
                        alt={featured.title}
                        className='w-auto h-auto max-w-full md:max-w-[60%] max-h-[75vh] mx-auto md:mx-0 shrink-0'
                    />
                ) : null}

                <div className='md:flex-1 min-w-0'>
                    <h2 className='text-xs uppercase tracking-[0.3em] text-gray-400 mb-4'>
                        {t(`featured.${SECTION_TITLES.includes(featured.type) ? featured.type : 'custom'}`)}
                    </h2>
                    <h3 className='text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6'>
                        {featured.title}
                    </h3>
                    {featured.description && (
                        <p className='text-lg text-gray-300 leading-relaxed whitespace-pre-line mb-10'>
                            {featured.description}
                        </p>
                    )}

                    {ctas.length > 0 && (
                        <div className='flex flex-col sm:flex-row sm:flex-wrap gap-3'>
                            {ctas.map((cta, index) => (
                                <a
                                    key={`${cta.url}-${index}`}
                                    href={cta.url}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    data-umami-event='destacado-boton'
                                    data-umami-event-boton={cta.label}
                                    className={`text-white text-center font-bold py-3 px-6 transition ${index === 0 ? 'btn-double-border' : 'border border-white/30 hover:bg-white/10'}`}
                                >
                                    {cta.label}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
