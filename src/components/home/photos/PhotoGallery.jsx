import { usePhotos } from '../../../hooks/usePhotos';
import { SectionSkeleton, SectionError } from '../SectionState';
import { PhotoCard } from './PhotoCard';
import { useInView } from '../../../hooks/useInView';

export function PhotoGallery() {
    const [ref, isInView] = useInView();
    const { photos, loading, error } = usePhotos({ realtime: false });

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
                    <div className="flex flex-wrap justify-center items-center gap-6">
                        {photos.map((photo) => (
                            <PhotoCard key={photo.id} photo={photo} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}