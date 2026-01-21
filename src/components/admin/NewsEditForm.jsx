export function NewsEditForm({ editData, updating, onSave, onCancel, onDataChange, onImageUpload, uploading, images, onRemoveImage }) {
    return (
        <div className="space-y-4">
            <input
                type="text"
                name="title"
                value={editData.title}
                onChange={onDataChange}
                placeholder="Título"
                className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white"
            />

            <textarea
                name="content"
                value={editData.content}
                onChange={onDataChange}
                placeholder="Contenido"
                rows="4"
                className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white"
            />

            <select
                name="type"
                value={editData.type || 'news'}
                onChange={onDataChange}
                className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white"
            >
                <option value="news">Noticia</option>
                <option value="interview">Entrevista</option>
            </select>

            {editData.type === 'interview' && (
                <input
                    type="url"
                    name="externalLink"
                    value={editData.externalLink || ''}
                    onChange={onDataChange}
                    placeholder="Link YouTube"
                    className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white"
                />
            )}

            {editData.type === 'news' && (
                <div>
                    <label className="block text-sm font-semibold mb-2">Imágenes</label>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={onImageUpload}
                        disabled={uploading}
                        id="edit-file-input"
                        className="hidden"
                    />
                    <label
                        htmlFor="edit-file-input"
                        className='w-full block bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white cursor-pointer text-center hover:bg-gray-800 transition'
                    >
                        {uploading ? 'Subiendo...' : 'Agregar imágenes'}
                    </label>

                    {images && images.length > 0 && (
                        <div className='mt-4 grid grid-cols-3 gap-4'>
                            {images.map((url, index) => (
                                <div key={index} className='relative'>
                                    <img src={url} alt={`preview-${index}`} className='w-full h-24 object-cover rounded' />
                                    <button
                                        type="button"
                                        onClick={() => onRemoveImage(index)}
                                        className='absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm'
                                    >
                                        x
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <label className="flex items-center">
                <input
                    type="checkbox"
                    name="featured"
                    checked={editData.featured}
                    onChange={(e) => onDataChange({ target: { name: 'featured', type: 'checkbox', checked: e.target.checked } })}
                    className="w-4 h-4 mr-2"
                />
                <span className="text-sm font-semibold">Destacar</span>
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
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 rounded transition"
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
}