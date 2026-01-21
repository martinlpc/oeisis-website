import { useNews } from '../../../hooks/useNews';
import { useInView } from '../../../hooks/useInView';
import { NewsArticle } from './NewsArticle';

export function NewsList() {
    const [ref, isInView] = useInView()
    const { news, loading, error } = useNews();

    const renderContentWithLinks = (content) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;

        return content.split(urlRegex).map((part, index) => {
            if (urlRegex.test(part)) {
                return (
                    <a
                        key={index}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline"
                    >
                        {part}
                    </a >
                );
            }
            return part;
        });
    }

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
            className={`bg-[#141414] min-h-screen text-white py-20 px-4 transition-opacity duration-1000 ${isInView ? 'opacity-100' : 'opacity-0'}`}
        >
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-12 text-center">Últimas Noticias</h2>

                {news.length === 0 ? (
                    <p className="text-center text-gray-400 text-lg">No hay noticias aún</p>
                ) : (
                    <div className="space-y-12">
                        {news.map((item) => (
                            <NewsArticle
                                key={item.id}
                                item={item}
                                renderContentWithLinks={renderContentWithLinks}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}