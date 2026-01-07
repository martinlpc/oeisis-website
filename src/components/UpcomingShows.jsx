import { useShows } from '../hooks/useShows.js'
import { ShowCard } from './ShowCard.jsx'

export function UpcomingShows() {
    const { shows, loading, error } = useShows()

    if (loading) {
        return (
            <div className='min-h-screen bg-black flex items-center justify-center'>
                <p className='text-white text-xl'>Cargando shows...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className='min-h-screen bg-black flex items-center justify-center'>
                <p className='text-red-500 text-xl'>Error: {error}</p>
            </div>
        )
    }

    return (
        <section className='min-h-screen bg-black text-white py-20 px-4 flex items-center justify-center'>
            <div className='max-w-4xl mx-auto'>
                <h2 className='text-5xl font-bold mb-12 text-center'>Próximos shows</h2>
                <div className='h-8'></div>

                {shows.length === 0 ? (
                    <p className='text-center text-gray-400 text-lg'>No hay shows programados</p>
                ) : (
                    <div className='flex flex-col gap-6'>
                        {shows.map((show) => (
                            <ShowCard key={show.id} show={show} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}