import { useNews } from '../../../hooks/useNews';
import { useInView } from '../../../hooks/useInView';

export function NewsList() {
    const [ref, isInView] = useInView()
    const { news, loading, error } = useNews();

    if (loading) {
        return (
            <div className="min-h-screen  flex items-center justify-center">
                <p className="text-white text-xl">Cargando noticias...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen  flex items-center justify-center">
                <p className="text-red-500 text-xl">Error: {error}</p>
            </div>
        );
    }

    return (
        <section
            ref={ref}
            className={`min-h-screen  text-white py-20 px-4 flex items-center justify-center transition-opacity duration-1000 ${isInView ? 'opacity-100' : 'opacity-0'}`}
        >
            <div className="max-w-4xl mx-auto">
                <h2 className="text-5xl font-bold mb-12 text-center">Últimas Noticias</h2>

                {news.length === 0 ? (
                    <p className="text-center text-gray-400 text-lg">No hay noticias aún</p>
                ) : (
                    <div className="space-y-12">
                        {news.map((item) => (
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
                                <p className="text-gray-300 mb-6 leading-relaxed">
                                    {item.content}
                                </p>

                                {/* Imágenes */}
                                {item.images && item.images.length > 0 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                        {item.images.map((imageUrl, index) => (
                                            <div
                                                key={index}
                                                className="overflow-hidden rounded-lg h-48"
                                            >
                                                <img
                                                    src={imageUrl}
                                                    alt={`Noticia ${item.title} - imagen ${index + 1}`}
                                                    className="w-full h-full object-cover hover:scale-105 transition"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Badge de destacado */}
                                {item.featured && (
                                    <div className="inline-block bg-blue-600 text-white px-4 py-1 rounded text-sm font-semibold">
                                        ⭐ Destacado
                                    </div>
                                )}
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}