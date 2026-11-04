// Botón o texto de entradas según el show: link de compra, entrada libre (con o sin reserva) o próximamente
export function TicketAction({ show, className = 'w-full md:w-64' }) {
    const base = `block text-center font-bold whitespace-nowrap py-3 px-4 ${className}`;

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
