import { useNews } from '../../../hooks/useNews';
import { useInView } from '../../../hooks/useInView';
import { NewsArticle } from './NewsArticle';
import { Fragment } from 'react';

const URL_REGEX = /(https?:\/\/[^\s]+)/;
const TRAILING_PUNCTUATION = /[.,;:!?)\]]+$/;

export function NewsList() {
    const [ref, isInView] = useInView()
    const { news, loading, error } = useNews({ realtime: false });

    const renderContentWithLinks = (content) => {
        // split con grupo de captura: las URLs quedan siempre en las posiciones impares
        return String(content || '').split(URL_REGEX).map((part, index) => {
            if (index % 2 === 0) return part

            // La puntuación pegada al final ("mirá https://x.com.") queda afuera del link
            const trailing = part.match(TRAILING_PUNCTUATION)?.[0] || ''
            const url = trailing ? part.slice(0, -trailing.length) : part

            return (
                <Fragment key={index}>
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline"
                    >
                        {url}
                    </a>
                    {trailing}
                </Fragment>
            );
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
            <div className="py-20 px-4 text-center">
                <p className="text-gray-400 text-lg">No pudimos cargar las noticias. Probá recargar la página.</p>
            </div>
        )
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