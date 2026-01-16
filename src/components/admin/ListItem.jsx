export function ListItem({ item, onEdit, onDelete }) {
    return (
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                {item.date && <p className="text-gray-400 text-sm mb-2">{item.date}</p>}
                {item.content && <p className="text-gray-300 line-clamp-2">{item.content}</p>}
                {item.description && <p className="text-gray-300 line-clamp-2">{item.description}</p>}
                {item.featured && <span className="text-xs text-blue-400 mt-2">⭐ Destacado</span>}
            </div>

            <div className="flex gap-2">
                <button
                    onClick={() => onEdit(item)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                >
                    Editar
                </button>
                <button
                    onClick={() => onDelete(item.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
                >
                    Eliminar
                </button>
            </div>
        </div>
    );
}