import { useState } from "react";
import { useVideos } from "../../hooks/useVideos";

export function VideoForm() {
    const INITIAL_FORM_DATA = {
        embedUrl: '',
        date: '',
        description: '',
        featured: false,
        title: ''
    }

    const { createVideo } = useVideos()
    const [formData, setFormData] = useState(INITIAL_FORM_DATA)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        try {
            await createVideo(formData)
            setMessage('✅ Video creado exitosamente')
            setFormData(INITIAL_FORM_DATA)
        } catch (error) {
            setMessage(`❌ Error: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className='min-h-screen text-white py-20 px-4'>
            <div className="max-w-2xl mx-auto">
                {message && (
                    <div className='mb-6 p-4 rounded bg-gray-800 border border-gray-700'>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className='space-y-6'>
                    {/* Title */}
                    <div>
                        <label className='block text-sm font-semibold mb-2'>Título</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder='Título del video...'
                            className='w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:border-blue-500 outline-none'
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className='block text-sm font-semibold mb-2'>Descripción</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder='Descripción del video...'
                            rows="4"
                            className='w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:border-blue-500 outline-none'
                        />
                    </div>

                    {/* YouTube Embed URL */}
                    <div>
                        <label className='block text-sm font-semibold mb-2'>Link YouTube embed</label>
                        <input
                            type="url"
                            name="embedUrl"
                            value={formData.embedUrl}
                            onChange={handleChange}
                            placeholder='https://www.youtube.com/embed/VIDEO_ID'
                            className='w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:border-blue-500 outline-none'
                            required
                        />
                        <p className='text-xs text-gray-400 mt-1'>Ej: https://www.youtube.com/embed/dQw4w9WgXcQ</p>
                    </div>

                    {/* Date */}
                    <div>
                        <label className='block text-sm font-semibold mb-2'>Año</label>
                        <input
                            type="text"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            placeholder='2026'
                            className='w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:border-blue-500 outline-none'
                        />
                    </div>

                    {/* Featured checkbox */}
                    <div>
                        <label className='flex items-center'>
                            <input
                                type="checkbox"
                                name="featured"
                                checked={formData.featured}
                                onChange={handleChange}
                                className='w-4 h-4 mr-2'
                            />
                            <span className='text-sm font-semibold'>Destacado</span>
                        </label>
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white font-bold py-3 rounded transition'
                    >
                        {loading ? 'Creando...' : 'Crear video'}
                    </button>
                </form>
            </div>
        </section>
    )
}