import { useVideos } from "../../../hooks/useVideos";
import { SectionSkeleton, SectionError } from '../SectionState'
import { VideoCard } from "./VideoCard";
import { useInView } from "../../../hooks/useInView"
import { useLang } from "../../../i18n/lang"
import { localize } from "../../../i18n/content"

export function VideoGallery() {
    const [ref, isInView] = useInView()
    const { videos, loading, error } = useVideos({ realtime: false })
    const { lang, t } = useLang()

    if (loading) {
        return <SectionSkeleton id='videos' title={t('videos.title')} variant='grid' count={3} />
    }

    if (error) {
        return <SectionError id='videos' title={t('videos.title')} what={t('videos.what')} />
    }

    return (
        <section
            id='videos'
            ref={ref}
            className={`min-h-screen text-white py-20 px-4 transition-opacity duration-1000 ${isInView ? 'opacity-100' : 'opacity-0'}`}
        >
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-12 text-center">{t('videos.title')}</h2>

                {videos.length === 0 ? (
                    <>
                        <p className="text-center text-gray-400 text-lg">{t('videos.empty')}</p>
                        <p className="text-center text-gray-400 text-lg">{t('videos.send')}</p>
                    </>
                ) : (
                    <div className="flex flex-wrap justify-center items-center gap-6">
                        {videos.map((video) => (
                            <div key={video.id} className="w-full max-w-sm">
                                <VideoCard video={localize('videos', video, lang)} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}