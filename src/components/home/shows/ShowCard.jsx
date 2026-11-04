import { useInView } from "../../../hooks/useInView";
import { getShowISO } from "../../../hooks/useShows";

// "2026-11-20" -> { weekday: 'VIE', day: '20', month: 'NOV', year: 2026 }
function getDateParts(show) {
    const iso = getShowISO(show);
    if (!iso) return null;
    const [year, month, day] = iso.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const short = (options) => date.toLocaleDateString('es-AR', options).replace('.', '').toUpperCase();
    return {
        weekday: short({ weekday: 'short' }),
        day: String(day).padStart(2, '0'),
        month: short({ month: 'short' }),
        year,
    };
}

function TicketAction({ show }) {
    const base = 'block w-full md:w-64 text-center font-bold whitespace-nowrap py-3 px-4';

    if (show.ticketLink) {
        return (
            <a
                href={show.ticketLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn-double-border text-white transition ${base}`}
            >
                {/* Un show libre puede tener link para reservar lugar */}
                {show.freeEntry ? 'Entrada libre · Reservar' : 'Comprar entradas'}
            </a>
        );
    }

    if (show.freeEntry) {
        return <p className={`text-white border border-white ${base}`}>Entrada libre</p>;
    }

    return <p className={`text-gray-400 font-semibold border border-white/15 ${base}`}>Entradas próximamente</p>;
}

export function ShowCard({ show }) {
    const [ref, isInView] = useInView();
    const date = getDateParts(show);
    const showYear = date && date.year !== new Date().getFullYear();
    const { venue, city, address } = show.location || {};
    const place = [venue, city].filter(Boolean).join(' · ');
    const details = [show.time && `${show.time} hs`, address].filter(Boolean).join(' · ');

    return (
        <article
            ref={ref}
            className={`grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_auto] items-center gap-x-6 md:gap-x-10 gap-y-5 py-8 border-t border-white/10 transition-opacity duration-700 ${isInView ? 'opacity-100' : 'opacity-0'}`}
        >
            {/* Fecha */}
            {date ? (
                <time dateTime={getShowISO(show)} className="w-16 md:w-20 text-center leading-none">
                    <span className="block text-xs tracking-widest text-gray-400">{date.weekday}</span>
                    <span className="block text-4xl md:text-5xl font-bold my-1">{date.day}</span>
                    <span className="block text-sm tracking-widest">{date.month}</span>
                    {showYear && <span className="block text-xs text-gray-400 mt-1">{date.year}</span>}
                </time>
            ) : (
                <span className="w-16 md:w-20 text-center text-gray-400">{show.date}</span>
            )}

            {/* Título y lugar */}
            <div className="min-w-0">
                <h3 className="text-xl md:text-2xl font-bold text-white">{show.title}</h3>
                {place && <p className="text-gray-200 mt-1">{place}</p>}
                {details && <p className="text-sm text-gray-400 mt-1">{details}</p>}
                {show.description && <p className="text-sm text-gray-400 mt-3">{show.description}</p>}
            </div>

            {/* Entradas: abajo a lo ancho en mobile, a la derecha en desktop */}
            <div className="col-span-2 md:col-span-1">
                <TicketAction show={show} />
            </div>
        </article>
    );
}
