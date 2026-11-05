import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Navbar } from '../components/home/Navbar';
import { Footer } from '../components/home/Footer';
import { TicketAction } from '../components/home/shows/TicketAction';
import { useShow, isPastShow } from '../hooks/useShows';
import { track } from '../utils/analytics';
import {
    getDateParts, getPlace, getMapsUrl, getMapEmbedUrl, getGoogleCalendarUrl, getIcsContent, getEventJsonLd, formatShowTime,
} from '../utils/showDetails';
import { useLang } from '../i18n/lang';
import { localize } from '../i18n/content';

const secondaryButton = 'inline-flex items-center justify-center gap-2 border border-white/25 hover:bg-white/10 px-4 py-3 text-sm font-semibold transition';

function downloadIcs(show, pageUrl) {
    const blob = new Blob([getIcsContent(show, pageUrl)], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oeisis-${show.dateISO || 'show'}.ics`;
    a.click();
    URL.revokeObjectURL(url);
}

function ShareButton({ title, url }) {
    const [copied, setCopied] = useState(false);
    const { t } = useLang();

    const share = async () => {
        track('compartir-show');
        // En celulares abre el menú nativo para compartir (WhatsApp, Instagram, etc.)
        if (navigator.share) {
            try {
                await navigator.share({ title, url });
            } catch {
                // el usuario canceló
            }
            return;
        }
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <button type="button" onClick={share} className={secondaryButton}>
            {copied ? t('show.copied') : t('show.share')}
        </button>
    );
}

function PageShell({ children }) {
    const { t, path } = useLang();
    return (
        <div className="min-h-screen text-white flex flex-col">
            <Navbar />
            <main className="flex-1 pt-28 pb-20 md:pt-36 md:pb-28 px-4 md:px-6">
                <div className="max-w-4xl mx-auto">
                    <Link to={path('/#upcoming-shows')} className="text-sm text-gray-400 hover:text-white">{t('show.back')}</Link>
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
}

export function ShowPage() {
    const { id } = useParams();
    const { show: raw, status } = useShow(id);
    const { lang, t } = useLang();
    const show = localize('shows', raw, lang);

    if (status === 'loading') {
        return (
            <PageShell>
                <div aria-busy="true" className="mt-10 space-y-4">
                    <div className="h-12 w-2/3 bg-white/5 motion-safe:animate-pulse rounded" />
                    <div className="h-40 bg-white/5 motion-safe:animate-pulse rounded" />
                </div>
            </PageShell>
        );
    }

    if (status !== 'ready') {
        return (
            <PageShell>
                <title>{`${t('show.notFoundTitle')} · Oeisis`}</title>
                <h1 className="text-3xl font-bold mt-10 mb-4">
                    {status === 'not-found' ? t('show.notFound') : t('show.loadError')}
                </h1>
                <p className="text-gray-400">{t('show.notFoundHint')}</p>
            </PageShell>
        );
    }

    const pageUrl = window.location.href;
    const past = isPastShow(show);
    const date = getDateParts(show, lang);
    const { venue, address, city, province } = getPlace(show);
    const mapsUrl = getMapsUrl(show);
    const mapEmbedUrl = getMapEmbedUrl(show, lang);
    const calendarUrl = getGoogleCalendarUrl(show, pageUrl);
    const jsonLd = getEventJsonLd(show, pageUrl);
    const description = `${date?.long || show.date}${venue ? t('show.at', { venue }) : ''}${city ? `, ${city}` : ''}.`;

    return (
        <PageShell>
            {/* React 19 lleva title y meta al <head> */}
            <title>{`${show.title} · Oeisis`}</title>
            <meta name="description" content={t('show.meta', { text: description })} />
            {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}

            <article className="mt-10">
                <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-4">
                    {past ? t('show.past') : t('show.upcoming')}
                </p>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-8">{show.title}</h1>

                {/* Con flyer: flyer a la derecha en desktop y arriba en mobile */}
                <div className={show.flyer ? 'md:grid md:grid-cols-[minmax(0,1fr)_16rem] md:gap-10 md:items-start' : ''}>
                    {show.flyer && (
                        <a href={show.flyer} target="_blank" rel="noopener noreferrer" className="block md:order-2 mb-8 md:mb-0 md:sticky md:top-24">
                            <img src={show.flyer} alt={t('show.flyerAlt', { title: show.title })} className="w-full max-h-[70vh] object-contain mx-auto rounded" />
                        </a>
                    )}
                    <div className="md:order-1 min-w-0">
                        <div className="grid sm:grid-cols-2 gap-8 border-y border-white/10 py-8 mb-8">
                            <div>
                                <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">{t('show.when')}</p>
                                <p className="text-xl font-semibold first-letter:uppercase">{date?.long || show.date}</p>
                                {show.time && <p className="text-gray-300">{formatShowTime(show, lang)}</p>}
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">{t('show.where')}</p>
                                {venue && <p className="text-xl font-semibold">{venue}</p>}
                                <p className="text-gray-300">{[address, city, province].filter(Boolean).join(', ')}</p>
                                {mapsUrl && (
                                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer" data-umami-event="ver-mapa" className="inline-block mt-2 text-sm underline underline-offset-4 text-gray-300 hover:text-white">
                                        {t('show.viewMap')}
                                    </a>
                                )}
                            </div>
                        </div>

                        {show.description && (
                            <p className="text-lg text-gray-300 leading-relaxed whitespace-pre-line mb-10">{show.description}</p>
                        )}

                        {past ? (
                            <p className="text-gray-400 mb-6">{t('show.pastNote')}</p>
                        ) : (
                            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
                                <TicketAction show={show} className="w-full sm:w-auto sm:min-w-56" />
                                {calendarUrl && (
                                    <a href={calendarUrl} target="_blank" rel="noopener noreferrer" data-umami-event="agendar" data-umami-event-tipo="google" className={secondaryButton}>
                                        {t('show.calendar')}
                                    </a>
                                )}
                                <button type="button" onClick={() => { downloadIcs(show, pageUrl); track('agendar', { tipo: 'ics' }); }} className={secondaryButton}>
                                    {t('show.ics')}
                                </button>
                                <ShareButton title={`Oeisis: ${show.title}`} url={pageUrl} />
                            </div>
                        )}
                    </div>
                </div>

                {/* El mapa carga recién cuando se acerca a la pantalla */}
                {mapEmbedUrl && (
                    <div className="mt-12 aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-lg border border-white/10 bg-white/5">
                        <iframe
                            src={mapEmbedUrl}
                            title={t('show.map', { place: venue || city || show.title })}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            allowFullScreen
                            className="w-full h-full border-0"
                        />
                    </div>
                )}
            </article>
        </PageShell>
    );
}
