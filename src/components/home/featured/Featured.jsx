import { useFeatured } from '../../../hooks/useFeatured'
import { useInView } from '../../../hooks/useInView'

export function Featured() {
    const { featured, loading, error } = useFeatured()
    const [ref, isInView] = useInView()

    if (loading) {
        return (
            <div className='min-h-screen bg-black flex items-center justify-center'>
                <p className='text-white text-xl'>Cargando sección destacada...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className='min-h-screen bg-black flex items-center justify-center'>
                <p className='text-white text-xl'>Error: {error}</p>
            </div>
        )
    }

    if (!featured) {
        return null
    }

    return (
        <section
            ref={ref}
            className={`relative w-full min-h-screen text-white overflow-hidden transition-opacity duration-1000 ${isInView ? 'opacity-100' : 'opacity-0'}`}
        >
            {/* Imagen/video de fondno */}
            <div className='absolute inset-0 pointer-events-none w-full h-full'>
                {featured.type === 'video' && featured.videoUrl ? (
                    <>
                        <iframe
                            src={featured.videoUrl}
                            className='w-full h-full object-contain'
                            title={featured.title}
                            allow='accelerometer; autoplay; clipboard-white; encrypted-media; gyroscope; picture-in-picture'
                            allowFullScreen
                        />
                        {/* Overlay oscuro */}
                        <div className='absolute inset-0 bg-black/50' />
                    </>
                ) : featured.image ? (
                    <>
                        <img
                            src={featured.image}
                            alt={featured.title}
                            className='w-full h-full object-contain'
                        />
                        {/* Overlay oscuro */}
                        <div className='absolute inset-0 bg-black/50' />
                    </>
                ) : null}

            </div>

            {/* Contenido */}
            {featured.type !== 'video' && (
                <div className="relative z-20 h-screen flex items-center justify-center px-4">
                    <div className="text-center max-w-3xl">
                        <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight text-center">
                            {featured.title}
                        </h1>

                        <p className="text-lg md:text-2xl text-gray-200 mb-16 leading-relaxed">
                            {featured.description}
                        </p>

                        {/* CTAs */}
                        {featured.ctas && featured.ctas.length > 0 && (
                            <div className='flex flex-col md:flex-row gap-6 justify-center'>
                                {featured.ctas.map((cta, index) => (
                                    <a
                                        key={index}
                                        href={cta.url}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        style={{ padding: '10px 64px' }}
                                        className='inline-block bg-blue-600 hover:bg-blue-700 text-white rounded transition text-lg'
                                    >
                                        {cta.label}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    )
}