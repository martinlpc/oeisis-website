export function PhotoEditForm({ editData, updating, onSave, onCancel, onDataChange }) {
    return (
        <div className="space-y-4">
            {/* Preview actual */}
            {editData.imageUrl && (
                <div>
                    <p className='text-sm font-semibold mb-2'>Preview actual</p>
                    <img src={editData.imageUrl} alt="preview" className='w-full h-32 object-cover rounded' />
                </div>
            )}

            <input
                type="text"
                name="title"
                value={editData.title}
                onChange={onDataChange}
                placeholder="Título"
                className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white"
            />

            <input
                type="text"
                name="date"
                value={editData.date}
                onChange={onDataChange}
                placeholder="Año"
                className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white"
            />

            <input
                type="text"
                name="album"
                value={editData.album}
                onChange={onDataChange}
                placeholder="Álbum"
                className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white"
            />

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
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 rounded transition"
                >
                    Cancelar
                </button>
            </div>
        </div>
    )
}