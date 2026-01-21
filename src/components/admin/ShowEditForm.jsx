export function ShowEditForm({ editData, updating, onSave, onCancel, onLocationChange, onDataChange }) {
    return (
        <div className="space-y-4">
            <input
                type="text"
                name="title"
                value={editData.title}
                onChange={onDataChange}
                className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white"
            />

            <div className="grid md:grid-cols-2 gap-4">
                <input
                    type="date"
                    name="date"
                    value={editData?.date || ''}
                    onChange={onDataChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white"
                    required
                />
                <input
                    type="time"
                    name="time"
                    value={editData.time || ''}
                    onChange={onDataChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white"
                    required
                />
            </div>

            <input
                type="text"
                value={editData.location?.venue}
                onChange={(e) => onLocationChange('venue', e.target.value)}
                placeholder="Venue"
                className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white"
            />

            <div className="grid md:grid-cols-2 gap-4">
                <input
                    type="text"
                    value={editData.location?.city}
                    onChange={(e) => onLocationChange('city', e.target.value)}
                    placeholder="Ciudad"
                    className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white"
                />
                <input
                    type="text"
                    value={editData.location?.address}
                    onChange={(e) => onLocationChange('address', e.target.value)}
                    placeholder="Domicilio"
                    className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white"
                />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <input
                    type="text"
                    value={editData.location?.province}
                    onChange={(e) => onLocationChange('province', e.target.value)}
                    placeholder="Provincia"
                    className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white"
                />
                <input
                    type="text"
                    value={editData.location?.country}
                    onChange={(e) => onLocationChange('country', e.target.value)}
                    placeholder="País"
                    className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white"
                />
            </div>

            <input
                type="url"
                value={editData.ticketLink || ''}
                onChange={(e) => onDataChange({ target: { name: 'ticketLink', value: e.target.value } })}
                placeholder="Link de las entradas"
                className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white"
            />

            <textarea
                name="description"
                value={editData.description}
                onChange={onDataChange}
                placeholder="Descripción"
                rows="3"
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
    );
}