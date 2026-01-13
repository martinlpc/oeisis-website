import { useVideos } from "../../../hooks/useVideos";
import { VideoCard } from "./VideoCard";
import { useInView } from "../../../hooks/useInView"

export function VideoGallery() {
    const [ref, isInView] = useInView()
    const { videos, loading, error } = useVideos()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-white text-xl">Cargando videos...</p>
            </div>
        )
    }

    if (error) {
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-white text-xl">Error: {error}</p>
        </div>
    }

    return (
        <section
            ref={ref}
            className={`min-h-screen text-white py-20 px-4 transition-opacity duration-1000 ${isInView ? 'opacity-100' : 'opacity-0'}`}
        >
            <div className="max-w-6xl mx-auto">
                <h2 className="text-5xl font-bold mb-12 text-center">Videos</h2>

                {videos.length === 0 ? (
                    <p className="text-center text-gray-400 text-lg">Videos proximamente</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {videos.map((video) => (
                            <VideoCard key={video.id} video={video} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}