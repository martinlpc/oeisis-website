import { Link } from "react-router-dom";
import { useInView } from "../../../hooks/useInView";
import { getShowISO } from "../../../hooks/useShows";
import { getDateParts, formatShowTime } from "../../../utils/showDetails";
import { TicketAction } from "./TicketAction";
import { useLang } from "../../../i18n/lang";
import { localize } from "../../../i18n/content";

export function ShowCard({ show: raw }) {
    const [ref, isInView] = useInView();
    const { lang, t, path } = useLang();
    const show = localize('shows', raw, lang);
    const date = getDateParts(show, lang);
    const showYear = date && date.year !== new Date().getFullYear();
    const { venue, city, address } = show.location || {};
    const place = [venue, city].filter(Boolean).join(' · ');
    const details = [formatShowTime(show, lang), address].filter(Boolean).join(' · ');

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

            {/* Título y lugar; el título lleva a la página del show */}
            <div className="min-w-0">
                <h3 className="text-xl md:text-2xl font-bold text-white">
                    <Link to={path(`/shows/${show.id}`)} className="hover:underline underline-offset-4">
                        {show.title}
                    </Link>
                </h3>
                {place && <p className="text-gray-200 mt-1">{place}</p>}
                {details && <p className="text-sm text-gray-400 mt-1">{details}</p>}
                {show.description && <p className="text-sm text-gray-400 mt-3 line-clamp-2">{show.description}</p>}
                <Link to={path(`/shows/${show.id}`)} className="inline-block mt-3 text-sm text-gray-300 underline underline-offset-4 hover:text-white">
                    {t('shows.details')}
                </Link>
            </div>

            {/* Entradas: abajo a lo ancho en mobile, a la derecha en desktop */}
            <div className="col-span-2 md:col-span-1">
                <TicketAction show={show} />
            </div>
        </article>
    );
}
