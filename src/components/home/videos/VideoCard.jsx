export function VideoCard({ video }) {
    return (
        <div className="bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition">
            {/* Thumbnail del video */}
            <div className="relative w-full aspect-video bg-black">
                <iframe
                    src={`${video.embedUrl}?rel=0`}
                    className="w-full h-full"
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>

            {/* Info */}
            <div className="p-4">
                <h3 className="text-lg font-bold mb-2 text-white">{video.title}</h3>
                <p className="text-sm text-gray-400 mb-3">{video.description}</p>
                <p className="text-xs text-gray-500">{video.date}</p>
            </div>
        </div>
    )
}