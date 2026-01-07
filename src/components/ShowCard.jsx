export function ShowCard({ show }) {
    return (
        <div className="border border-gray-700 rounded-lg p-6 hover:border-blue-500 transition">
            <p className="text-2xl text-center font-bold text-white border-b border-gray-700 pb-6">
                {show.title}
            </p>
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
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded transition text-center"
                        >
                            Comprar Entradas
                        </a>
                    ) : (
                        <button className="w-full bg-gray-700 text-gray-400 font-bold py-3 px-6 rounded cursor-not-allowed">
                            Próximamente
                        </button>
                    )}
                </div>
            </div>

            {show.description && (
                <p className="text-center mt-4 text-gray-300 border-t border-gray-700 pt-4">
                    {show.description}
                </p>
            )}
        </div>
    );
}