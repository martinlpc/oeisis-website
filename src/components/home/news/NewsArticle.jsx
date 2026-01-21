import { InterviewThumbnail } from "./InterviewThumbnail"

export function NewsArticle({ item, renderContentWithLinks }) {
    return (
        <article
            key={item.id}
            className="border-l-4 border-blue-600 pl-6 pb-12"
        >
            {/* Fecha */}
            <div className="flex items-center mb-4">
                <span className="text-sm text-gray-400">📅</span>
                <p className="text-gray-400 text-sm ml-2">{item.date}</p>
            </div>

            {/* Título */}
            <h3 className="text-3xl font-bold mb-4">{item.title}</h3>

            {/* Contenido */}
            <p className="text-gray-300 mb-6 leading-relaxed break-words">
                {renderContentWithLinks(item.content)}
            </p>

            {/* Imágenes */}
            {item.images && item.images.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {item.images.map((imageUrl, index) => (
                        <div key={index} className="overflow-hidden rounded-lg h-48">
                            <img
                                src={imageUrl}
                                alt={`Noticia ${item.title} - imagen ${index + 1}`}
                                className="w-full h-full object-cover hover:scale-105 transition"
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Video */}
            {item.type === 'interview' && item.externalLink && (
                <InterviewThumbnail externalLink={item.externalLink} title={item.title} />
            )}

            {/* Badge */}
            {item.featured && (
                <div className="inline-block bg-blue-600 text-white px-4 py-1 rounded text-sm font-semibold">
                    ⭐ Destacado
                </div>
            )}
        </article>
    )
}