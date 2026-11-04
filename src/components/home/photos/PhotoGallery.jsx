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
    const [album, setAlbum] = useState(null); // null = todas
    const closeLightbox = useCallback(() => setOpenIndex(null), []);

    if (loading) {
        return <SectionSkeleton id='fotos' title='Galería de fotos' className='bg-[#141414]' variant='grid' count={6} />
    }

    if (error) {
        return <SectionError id='fotos' title='Galería de fotos' className='bg-[#141414]' what='las fotos' />
    }

    // Álbumes en el orden en que aparecen (las fotos ya vienen de la más nueva a la más vieja)
    const albums = [...new Set(photos.map(p => p.album?.trim()).filter(Boolean))];
    const visible = album ? photos.filter(p => p.album?.trim() === album) : photos;

    const selectAlbum = (name) => {
        setAlbum(name);
        setOpenIndex(null);
    };

    const chip = (active) => `px-4 py-2 text-sm border transition ${active ? 'border-white bg-white text-black font-semibold' : 'border-white/20 text-gray-300 hover:border-white/50 hover:text-white'}`;

    return (
        <section
            id='fotos'
            ref={ref}
            className={`bg-[#141414] min-h-screen text-white py-20 px-4 transition-opacity duration-1000 ${isInView ? 'opacity-100' : 'opacity-0'}`}
        >
            <div className="flex flex-col items-center">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-12 text-center">Galería de fotos</h2>

                {photos.length === 0 ? (
                    <>
                        <p className="text-center text-gray-400 text-lg">No hay fotos aún</p>
                        <p className="text-center text-gray-400 text-lg">¿Tenés fotos de algún show? Mandalas por Instagram y las sumamos.</p>
                    </>
                ) : (
                    <>
                    {albums.length > 0 && (
                        <div role="group" aria-label="Filtrar por álbum" className="flex flex-wrap justify-center gap-2 mb-8 max-w-6xl">
                            <button type="button" onClick={() => selectAlbum(null)} aria-pressed={!album} className={chip(!album)}>
                                Todas
                            </button>
                            {albums.map(name => (
                                <button key={name} type="button" onClick={() => selectAlbum(name)} aria-pressed={album === name} className={chip(album === name)}>
                                    {name}
                                </button>
                            ))}
                        </div>
                    )}
                    <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 w-full max-w-6xl">
                        {visible.map((photo, index) => (
                            <li key={photo.id}>
                                <PhotoCard photo={photo} onOpen={() => setOpenIndex(index)} />
                            </li>
                        ))}
                    </ul>
                    </>
                )}
            </div>

            {openIndex !== null && (
                <Lightbox
                    photos={visible}
                    index={openIndex}
                    onClose={closeLightbox}
                    onChange={setOpenIndex}
                />
            )}
        </section>
    );
}