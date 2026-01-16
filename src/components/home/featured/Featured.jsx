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
            id='featured-section'
            ref={ref}
            className={`py-10 bg-[#141414] relative w-full min-h-screen text-white overflow-hidden transition-opacity duration-1000 ${isInView ? 'opacity-100' : 'opacity-0'}`}
        >
            <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-8 text-center'>Próximamente</h2>

            {/* Media (imagen o video) */}
            <div className="relative w-full h-96 md:h-[500px] overflow-hidden">
                <div
                    className="absolute inset-0 w-full h-full overflow-hidden"
                >
                    {featured.type === 'video' && featured.videoUrl ? (
                        <iframe
                            src={`${featured.videoUrl}?rel=0`}
                            className="w-full h-full object-contain"
                            title={featured.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : featured.image ? (
                        <img
                            src={featured.image}
                            alt={featured.title}
                            className="w-full h-full object-contain"
                        />
                    ) : null}

                </div>
            </div>

            {/* Contenido debajo */}
            <div className="relative z-20 px-4 md:px-6 py-6 md:py-10">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-xl md:text-2xl lg:text-5xl font-bold mb-4 md:mb-8 leading-tight">
                        {featured.title}
                    </h1>

                    <p className="text-base md:text-lg lg:text-2xl text-gray-200 mb-8 md:mb-12 leading-relaxed">
                        {featured.description}
                    </p>

                    {/** Call to action's (CTAs) */}
                    {featured.ctas && featured.ctas.length > 0 && (
                        <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
                            {featured.ctas.map((cta, index) => (
                                <a
                                    key={index}
                                    href={cta.url}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    style={{ padding: '8px 16px' }}
                                    className='w-fit bg-black text-white transition text-sm md:text-base btn-double-border'
                                >
                                    {cta.label}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}