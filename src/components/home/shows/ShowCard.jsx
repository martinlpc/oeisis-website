import { useInView } from "../../../hooks/useInView";

export function ShowCard({ show }) {
    const [ref, isInView] = useInView()

    return (
        <div
            ref={ref}
            className={`border border-gray-700 rounded-lg p-6 hover:border-white/60 transition-[opacity,border-color] duration-1000 ${isInView ? 'opacity-100' : 'opacity-0'}`
            }>
            <h3 className="text-2xl text-center font-bold text-white border-b border-gray-700 pb-6">
                {show.title}
            </h3>
            <div className="grid md:grid-cols-3 gap-6 p-1">
                {/* Fecha */}
                <div>
                    <p className="text-gray-400 text-sm mb-1">FECHA</p>
                    <p className="text-xl font-bold">
                        {show.date}
                    </p>
                    <p className="text-lg text-gray-300">{show.time}</p>
                </div>

                {/* Lugar */}
                <div>
                    <p className="text-gray-400 text-sm mb-1">LUGAR</p>
                    <p className="text-xl font-semibold">{show.location?.venue}</p>
                    <p className="text-gray-300">{show.location?.city}</p>
                    <p className="text-sm text-gray-400">{show.location?.address}</p>
                </div>

                {/* Botón de entradas */}
                <div className="flex items-center">
                    {show.ticketLink ? (
                        <a
                            href={show.ticketLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-double-border w-full text-white font-bold py-3 px-6 transition text-center"
                        >
                            {/* Un show libre puede tener link para reservar lugar */}
                            {show.freeEntry ? 'Entrada libre · Reservar' : 'Comprar Entradas'}
                        </a>
                    ) : show.freeEntry ? (
                        <p className="w-full text-center text-white font-bold py-3 px-6 border border-white">
                            Entrada libre
                        </p>
                    ) : (
                        <p className="w-full text-center text-gray-400 font-semibold py-3 px-6 border border-gray-700">
                            Entradas próximamente
                        </p>
                    )}
                </div>
            </div>

            {
                show.description && (
                    <p className="text-center mt-4 text-gray-300 border-t border-gray-700 pt-4">
                        {show.description}
                    </p>
                )
            }
        </div >
    );
}