// src/components/ShowItem.jsx
export function ShowListItem({ show, onEdit, onDelete }) {
    return (
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-xl font-bold">{show.title}</h3>
                <p className="text-gray-400">
                    {show.date} - {show.time}
                </p>
                <p className="text-gray-400">
                    {show.location?.venue}, {show.location?.city}
                </p>
                <p className="text-gray-400 text-sm">
                    {show.location?.address}
                </p>
                {show.ticketLink && (
                    <a
                        href={show.ticketLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline text-sm"
                    >
                        Comprar entradas →
                    </a>
                )}
            </div>

            <div className="flex gap-2">
                <button
                    onClick={() => onEdit(show)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                >
                    Editar
                </button>
                <button
                    onClick={() => onDelete(show.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
                >
                    Eliminar
                </button>
            </div>
        </div >
    );
}