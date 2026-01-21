export function InterviewThumbnail({ externalLink, title }) {
    const getEmbedUrl = (url) => {
        let videoId
        let timestamp = ''

        if (url.includes('youtube.com/watch?v=')) {
            videoId = url.split('v=')[1].split('&')[0]
            // Extraer timestamp si existe
            if (url.includes('&t=')) {
                const t = url.split('&t=')[1]
                timestamp = t.replace('s', '') // "1395s" → "1395"
            }
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1].split('?')[0]
            if (url.includes('?t=')) {
                timestamp = url.split('?t=')[1].replace('s', '')
            }
        }

        const embedUrl = `https://www.youtube.com/embed/${videoId}`
        return timestamp ? `${embedUrl}?start=${timestamp}` : embedUrl
    };

    const embedUrl = getEmbedUrl(externalLink)
    if (!embedUrl) return null

    return (
        <div className="mb-6 rounded-lg overflow-hidden aspect-video">
            <iframe
                src={embedUrl}
                className="w-full h-full"
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </div>
    );
}