export function VideoEditForm({ editData, updating, onSave, onCancel, onDataChange }) {
    return (
        <div className="space-y-4">
            <input
                type="text"
                name='title'
                value={editData.title}
                onChange={onDataChange}
                placeholder="Título"
                className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white"
            />

            <textarea
                name="description"
                value={editData.description}
                onChange={onDataChange}
                placeholder="Descripción"
                rows='3'
                className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white"
            />

            <input
                type="text"
                name='date'
                value={editData.date}
                onChange={onDataChange}
                placeholder="Fecha de lo que muestra el video"
                className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white"
            />

            <label className="flex items-center">
                <input
                    type="checkbox"
                    name="featured"
                    checked={editData.featured}
                    onChange={(e) => onDataChange({ target: { name: 'featured', type: 'checkbox', checked: e.target.checked } })}
                    className="w-4 h-4 mr-2"
                />
                <span className="text-sm font-semibold">Destacar?</span>
            </label>

            <div className="flex gap-2">
                <button
                    onClick={onSave}
                    disabled={updating}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 text-white font-semibold py-2 rounded transition"
                >
                    {updating ? 'Guardando...' : 'Guardar'}
                </button>
                <button
                    onClick={onCancel}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 text-white font-semibold py-2 rounded transition"
                >
                    Cancelar
                </button>
            </div>
        </div>
    )
}