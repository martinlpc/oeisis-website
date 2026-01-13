import { usePhotos } from '../../../hooks/usePhotos';
import { PhotoCard } from './PhotoCard';
import { useInView } from '../../../hooks/useInView';

export function PhotoGallery() {
    const [ref, isInView] = useInView();
    const { photos, loading, error } = usePhotos();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-white text-xl">Cargando fotos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-500 text-xl">Error: {error}</p>
            </div>
        );
    }

    return (
        <section
            ref={ref}
            className={`min-h-screen text-white py-20 px-4 transition-opacity duration-1000 ${isInView ? 'opacity-100' : 'opacity-0'
                }`}
        >
            <div className="max-w-6xl mx-auto">
                <h2 className="text-5xl font-bold mb-12 text-center">Galería de Fotos</h2>

                {photos.length === 0 ? (
                    <p className="text-center text-gray-400 text-lg">No hay fotos aún</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {photos.map((photo) => (
                            <PhotoCard key={photo.id} photo={photo} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}