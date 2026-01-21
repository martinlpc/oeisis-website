import { useState, useEffect } from "react";
import { useFeatured } from "../../hooks/useFeatured";

export function FeaturedForm() {
    const [formData, setFormData] = useState({
        type: 'show',
        title: '',
        description: '',
        image: '',
        videoUrl: ''
    })
    const { featured, updateFeatured } = useFeatured()
    const [ctas, setCtas] = useState([])
    const [newCta, setNewCta] = useState({ label: '', url: '' })
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (featured) {
            setFormData({
                type: featured.type || 'show',
                title: featured.title || '',
                description: featured.description || '',
                image: featured.image || '',
                videoUrl: featured.videoUrl || ''
            })
            setCtas(featured.ctas || [])
        }
    }, [featured])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleAddCta = () => {
        if (newCta.label && newCta.url) {
            setCtas(prev => [...prev, { ...newCta }])
            setNewCta({ label: '', url: '' })
        }
    }

    const handleRemoveCta = (index) => {
        setCtas(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        try {
            const docData = {
                type: formData.type,
                title: formData.title,
                description: formData.description,
                image: formData.image,
                videoUrl: formData.videoUrl,
                ctas: ctas
            }

            await updateFeatured(docData, featured?.id || 'current')
            setMessage('Featured actualizado!')
        } catch (error) {
            setMessage(`Error: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="border border-gray-700 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Editar Sección Destacada</h2>

            {message && (
                <div className="mb-6 p-4 rounded bg-gray-800 border border-gray-700">
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Tipo */}
                <div>
                    <label className="block text-sm font-semibold mb-2">Tipo</label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:border-blue-500 outline-none"
                    >
                        <option value="show">Show</option>
                        <option value="video">Video</option>
                        <option value="news">Noticia</option>
                        <option value="custom">Personalizado</option>
                    </select>
                </div>

                {/* Título */}
                <div>
                    <label className="block text-sm font-semibold mb-2">Título</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Título del destacado..."
                        className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:border-blue-500 outline-none"
                        required
                    />
                </div>

                {/* Descripción */}
                <div>
                    <label className="block text-sm font-semibold mb-2">Descripción</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Descripción del destacado..."
                        rows="4"
                        className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:border-blue-500 outline-none"
                        required
                    />
                </div>

                {/* Imagen */}
                <div>
                    <label className="block text-sm font-semibold mb-2">URL de Imagen</label>
                    <input
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        placeholder="https://ejemplo.com/imagen.jpg"
                        className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:border-blue-500 outline-none"
                    />
                    {formData.image && (
                        <img src={formData.image} alt="preview" className="mt-2 h-32 rounded" />
                    )}
                </div>

                {/* Video URL */}
                {formData.type === 'video' && (
                    <div>
                        <label className="block text-sm font-semibold mb-2">URL de Video (YouTube embed)</label>
                        <input
                            type="url"
                            name="videoUrl"
                            value={formData.videoUrl}
                            onChange={handleChange}
                            placeholder="https://www.youtube.com/embed/..."
                            className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:border-blue-500 outline-none"
                        />
                    </div>
                )}

                {/* CTAs */}
                <div>
                    <label className="block text-sm font-semibold mb-2">Llamadas a Acción (CTAs)</label>

                    {/* Lista de CTAs existentes */}
                    {ctas.length > 0 && (
                        <div className="mb-4 space-y-2 bg-gray-800 p-4 rounded">
                            {ctas.map((cta, index) => (
                                <div key={index} className="flex justify-between items-center bg-gray-900 p-3 rounded">
                                    <div>
                                        <p className="font-semibold">{cta.label}</p>
                                        <p className="text-sm text-gray-400 truncate">{cta.url}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveCta(index)}
                                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                                    >
                                        Quitar
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Agregar CTA */}
                    <div className="space-y-2 bg-gray-800 p-4 rounded">
                        <input
                            type="text"
                            value={newCta.label}
                            onChange={(e) => setNewCta(prev => ({ ...prev, label: e.target.value }))}
                            placeholder="Label del botón (ej: Comprar Entradas)"
                            className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:border-blue-500 outline-none"
                        />
                        <input
                            type="url"
                            value={newCta.url}
                            onChange={(e) => setNewCta(prev => ({ ...prev, url: e.target.value }))}
                            placeholder="URL (ej: https://...)"
                            className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:border-blue-500 outline-none"
                        />
                        <button
                            type="button"
                            onClick={handleAddCta}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition"
                        >
                            + Agregar CTA
                        </button>
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white font-bold py-3 rounded transition"
                >
                    {loading ? 'Guardando...' : 'Guardar Featured'}
                </button>
            </form>
        </div>
    );
}