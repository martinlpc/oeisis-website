import { useCallback, useState } from 'react';
import { usePhotos } from '../../../hooks/usePhotos';
import { SectionSkeleton, SectionError } from '../SectionState';
import { PhotoCard } from './PhotoCard';
import { Lightbox } from './Lightbox';
import { useInView } from '../../../hooks/useInView';

export function PhotoGallery() {
    const [ref, isInView] = useInView();
    const { photos, loading, error } = usePhotos({ realtime: false });
    const [openIndex, setOpenIndex] = useState(null);
    const closeLightbox = useCallback(() => setOpenIndex(null), []);

    if (loading) {
        return <SectionSkeleton id='fotos' title='Galería de Fotos' className='bg-[#141414]' variant='grid' count={6} />
    }

    if (error) {
        return <SectionError id='fotos' title='Galería de Fotos' className='bg-[#141414]' what='las fotos' />
    }

    return (
        <section
            id='fotos'
            ref={ref}
            className={`bg-[#141414] min-h-screen text-white py-20 px-4 transition-opacity duration-1000 ${isInView ? 'opacity-100' : 'opacity-0'}`}
        >
            <div className="flex flex-col items-center">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-12 text-center">Galería de Fotos</h2>

                {photos.length === 0 ? (
                    <>
                        <p className="text-center text-gray-400 text-lg">No hay fotos aún</p>
                        <p className="text-center text-gray-400 text-lg">¿Querés ver una foto tuya acá? Enviala a nuestro Instagram mas abajo</p>
                    </>
                ) : (
                    <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 w-full max-w-6xl">
                        {photos.map((photo, index) => (
                            <li key={photo.id}>
                                <PhotoCard photo={photo} onOpen={() => setOpenIndex(index)} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {openIndex !== null && (
                <Lightbox
                    photos={photos}
                    index={openIndex}
                    onClose={closeLightbox}
                    onChange={setOpenIndex}
                />
            )}
        </section>
    );
}