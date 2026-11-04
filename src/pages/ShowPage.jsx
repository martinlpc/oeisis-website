import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Navbar } from '../components/home/Navbar';
import { Footer } from '../components/home/Footer';
import { TicketAction } from '../components/home/shows/TicketAction';
import { useShow, isPastShow } from '../hooks/useShows';
import {
    getDateParts, getPlace, getMapsUrl, getGoogleCalendarUrl, getIcsContent, getEventJsonLd,
} from '../utils/showDetails';

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

    const share = async () => {
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
            {copied ? 'Link copiado' : 'Compartir'}
        </button>
    );
}

function PageShell({ children }) {
    return (
        <div className="min-h-screen text-white flex flex-col">
            <Navbar />
            <main className="flex-1 pt-28 pb-20 md:pt-36 md:pb-28 px-4 md:px-6">
                <div className="max-w-4xl mx-auto">
                    <Link to="/#upcoming-shows" className="text-sm text-gray-400 hover:text-white">← Todos los shows</Link>
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
}

export function ShowPage() {
    const { id } = useParams();
    const { show, status } = useShow(id);

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
                <title>Show no encontrado · Oeisis</title>
                <h1 className="text-3xl font-bold mt-10 mb-4">
                    {status === 'not-found' ? 'No encontramos este show' : 'No pudimos cargar el show'}
                </h1>
                <p className="text-gray-400">Puede que se haya borrado o que el link esté mal. Fijate en la lista de shows.</p>
            </PageShell>
        );
    }

    const pageUrl = window.location.href;
    const past = isPastShow(show);
    const date = getDateParts(show);
    const { venue, address, city, province } = getPlace(show);
    const mapsUrl = getMapsUrl(show);
    const calendarUrl = getGoogleCalendarUrl(show, pageUrl);
    const jsonLd = getEventJsonLd(show, pageUrl);
    const description = `${date?.long || show.date}${venue ? ` en ${venue}` : ''}${city ? `, ${city}` : ''}.`;

    return (
        <PageShell>
            {/* React 19 lleva title y meta al <head> */}
            <title>{`${show.title} · Oeisis`}</title>
            <meta name="description" content={`Oeisis, tributo a Oasis: ${description}`} />
            {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}

            <article className="mt-10">
                <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-4">
                    {past ? 'Show anterior' : 'Próximo show'}
                </p>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-8">{show.title}</h1>

                <div className="grid sm:grid-cols-2 gap-8 border-y border-white/10 py-8 mb-8">
                    <div>
                        <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Cuándo</p>
                        <p className="text-xl font-semibold first-letter:uppercase">{date?.long || show.date}</p>
                        {show.time && <p className="text-gray-300">{show.time} hs</p>}
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Dónde</p>
                        {venue && <p className="text-xl font-semibold">{venue}</p>}
                        <p className="text-gray-300">{[address, city, province].filter(Boolean).join(', ')}</p>
                        {mapsUrl && (
                            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-sm underline underline-offset-4 text-gray-300 hover:text-white">
                                Ver en el mapa
                            </a>
                        )}
                    </div>
                </div>

                {show.description && (
                    <p className="text-lg text-gray-300 leading-relaxed whitespace-pre-line mb-10">{show.description}</p>
                )}

                {past ? (
                    <p className="text-gray-400 mb-6">Este show ya pasó. Mirá los próximos en la lista de shows.</p>
                ) : (
                    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
                        <TicketAction show={show} className="w-full sm:w-auto sm:min-w-56" />
                        {calendarUrl && (
                            <a href={calendarUrl} target="_blank" rel="noopener noreferrer" className={secondaryButton}>
                                Agregar a Google Calendar
                            </a>
                        )}
                        <button type="button" onClick={() => downloadIcs(show, pageUrl)} className={secondaryButton}>
                            Descargar evento (.ics)
                        </button>
                        <ShareButton title={`Oeisis: ${show.title}`} url={pageUrl} />
                    </div>
                )}
            </article>
        </PageShell>
    );
}
