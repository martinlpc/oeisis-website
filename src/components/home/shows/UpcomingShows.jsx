import { useInView } from '../../../hooks/useInView.js'
import { SectionSkeleton, SectionError } from '../SectionState.jsx'
import { ShowCard } from './ShowCard.jsx'

export function UpcomingShows({ shows, loading, error }) {
    const [ref, isInView] = useInView()

    if (loading) {
        return <SectionSkeleton id='upcoming-shows' title='Próximos shows' fullHeight={false} />
    }

    if (error) {
        return <SectionError id='upcoming-shows' title='Próximos shows' what='los shows' />
    }

    return (
        <section
            id='upcoming-shows'
            ref={ref}
            className={`bg-[#1f1f1f] text-white py-20 md:py-28 px-4 md:px-6 transition-opacity duration-1000 ${isInView ? 'opacity-100' : 'opacity-0'}`}
        >
            <div className='max-w-5xl mx-auto'>
                <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold mb-10 md:mb-14 text-center'>Próximos shows</h2>

                {shows.length === 0 ? (
                    <p className='text-center text-gray-400 text-lg'>No hay shows programados por ahora</p>
                ) : (
                    <div className='border-b border-white/10'>
                        {shows.map((show) => (
                            <ShowCard key={show.id} show={show} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}