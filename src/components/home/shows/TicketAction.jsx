import { useLang } from '../../../i18n/lang';

// Botón o texto de entradas según el show: link de compra, entrada libre (con o sin reserva) o próximamente
export function TicketAction({ show, className = 'w-full md:w-64' }) {
    const { t } = useLang();
    const base = `block text-center font-bold whitespace-nowrap py-3 px-4 ${className}`;

    if (show.ticketLink) {
        return (
            <a
                href={show.ticketLink}
                target="_blank"
                rel="noopener noreferrer"
                data-umami-event="entradas"
                data-umami-event-show={show.title}
                data-umami-event-tipo={show.freeEntry ? 'reserva' : 'compra'}
                className={`btn-double-border text-white transition ${base}`}
            >
                {/* Un show libre puede tener link para reservar lugar */}
                {show.freeEntry ? t('tickets.freeReserve') : t('tickets.buy')}
            </a>
        );
    }

    if (show.freeEntry) {
        return <p className={`text-white border border-white ${base}`}>{t('tickets.free')}</p>;
    }

    return <p className={`text-gray-400 font-semibold border border-white/15 ${base}`}>{t('tickets.soon')}</p>;
}
