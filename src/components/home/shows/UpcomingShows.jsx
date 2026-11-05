import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useInView } from '../../../hooks/useInView.js'
import { getShowISO } from '../../../hooks/useShows.js'
import { SectionSkeleton, SectionError } from '../SectionState.jsx'
import { ShowCard } from './ShowCard.jsx'
import { useLang } from '../../../i18n/lang'
import { shortDate } from '../../../utils/showDetails'

// Lista compacta de shows anteriores, agrupada por año (más recientes primero)
function PastShows({ shows }) {
    const [open, setOpen] = useState(false)
    const { lang, t, path } = useLang()
    if (shows.length === 0) return null

    const byYear = shows.reduce((groups, show) => {
        const year = (getShowISO(show) || '').slice(0, 4) || t('shows.noDate')
        ;(groups[year] ||= []).push(show)
        return groups
    }, {})

    return (
        <div className='mt-12 text-center'>
            <button
                type='button'
                onClick={() => setOpen(o => !o)}
                aria-expanded={open}
                aria-controls='past-shows'
                className='text-sm uppercase tracking-widest text-gray-300 hover:text-white border border-white/20 hover:border-white/50 px-6 py-3 transition'
            >
                {open ? t('shows.pastClose') : t('shows.pastOpen', { n: shows.length })}
            </button>

            {open && (
                <div id='past-shows' className='mt-10 text-left space-y-10'>
                    {/* Las claves numéricas se ordenan solas de menor a mayor: se invierte a mano */}
                    {Object.entries(byYear).sort(([a], [b]) => b.localeCompare(a)).map(([year, list]) => (
                        <div key={year}>
                            <h3 className='text-sm tracking-widest text-gray-400 mb-3'>{year}</h3>
                            <ul className='border-t border-white/10'>
                                {list.map(show => (
                                    <li key={show.id} className='border-b border-white/10'>
                                        <Link
                                            to={path(`/shows/${show.id}`)}
                                            className='grid grid-cols-[5.5rem_1fr] sm:grid-cols-[6rem_1fr_auto] gap-x-4 gap-y-1 py-3 text-gray-300 hover:text-white'
                                        >
                                            <span className='text-gray-400 tabular-nums'>{shortDate(show, lang)}</span>
                                            <span className='font-semibold'>{show.title}</span>
                                            <span className='col-start-2 sm:col-start-auto text-sm text-gray-400'>
                                                {[show.location?.venue, show.location?.city].filter(Boolean).join(', ')}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export function UpcomingShows({ shows, pastShows = [], loading, error }) {
    const [ref, isInView] = useInView()
    const { t } = useLang()

    if (loading) {
        return <SectionSkeleton id='upcoming-shows' title={t('shows.title')} fullHeight={false} />
    }

    if (error) {
        return <SectionError id='upcoming-shows' title={t('shows.title')} what={t('shows.what')} />
    }

    return (
        <section
            id='upcoming-shows'
            ref={ref}
            className={`bg-[#1f1f1f] text-white py-20 md:py-28 px-4 md:px-6 transition-opacity duration-1000 ${isInView ? 'opacity-100' : 'opacity-0'}`}
        >
            <div className='max-w-5xl mx-auto'>
                <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold mb-10 md:mb-14 text-center'>{t('shows.title')}</h2>

                {shows.length === 0 ? (
                    <p className='text-center text-gray-400 text-lg'>{t('shows.empty')}</p>
                ) : (
                    <div className='border-b border-white/10'>
                        {shows.map((show) => (
                            <ShowCard key={show.id} show={show} />
                        ))}
                    </div>
                )}

                <PastShows shows={pastShows} />
            </div>
        </section>
    )
}
