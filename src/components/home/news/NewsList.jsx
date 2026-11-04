import { useNews } from '../../../hooks/useNews';
import { SectionSkeleton, SectionError } from '../SectionState';
import { useInView } from '../../../hooks/useInView';
import { NewsArticle } from './NewsArticle';
import { Fragment, useState } from 'react';

const URL_REGEX = /(https?:\/\/[^\s]+)/;
const TRAILING_PUNCTUATION = /[.,;:!?)\]…]+$/;
// Cantidad de noticias visibles al principio y por cada "Ver más"
const PAGE_SIZE = 3;

export function NewsList() {
    const [ref, isInView] = useInView()
    const { news, loading, error } = useNews({ realtime: false });
    const [visible, setVisible] = useState(PAGE_SIZE);

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
        return <SectionSkeleton id='noticias' title='Últimas noticias' className='bg-[#141414]' fullHeight={false} />
    }

    if (error) {
        return <SectionError id='noticias' title='Últimas noticias' className='bg-[#141414]' what='las noticias' />
    }

    return (
        <section
            id='noticias'
            ref={ref}
            className={`bg-[#141414] text-white py-20 md:py-28 px-4 md:px-6 transition-opacity duration-1000 ${isInView ? 'opacity-100' : 'opacity-0'}`}
        >
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-12 text-center">Últimas noticias</h2>

                {news.length === 0 ? (
                    <p className="text-center text-gray-400 text-lg">No hay noticias aún</p>
                ) : (
                    <>
                        <div className="border-b border-white/10">
                            {news.slice(0, visible).map((item) => (
                                <NewsArticle
                                    key={item.id}
                                    item={item}
                                    renderContentWithLinks={renderContentWithLinks}
                                />
                            ))}
                        </div>
                        {visible < news.length && (
                            <div className="text-center mt-10">
                                <button
                                    type="button"
                                    onClick={() => setVisible(v => v + PAGE_SIZE)}
                                    className="btn-double-border text-white font-bold py-3 px-8"
                                >
                                    Ver más noticias ({news.length - visible})
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}