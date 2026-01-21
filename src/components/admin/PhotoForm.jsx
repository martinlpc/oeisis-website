import { useState } from 'react'
import { useCloudinaryUpload } from "../../hooks/useCloudinaryUpload";
import { usePhotos } from "../../hooks/usePhotos";

export function PhotoForm() {
    const INITIAL_FORM_DATA = {
        title: '',
        imageUrl: '',
        date: '',
        album: ''
    }

    const { uploadImage } = useCloudinaryUpload()
    const { createPhoto } = usePhotos()
    const [formData, setFormData] = useState(INITIAL_FORM_DATA)
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [message, setMessage] = useState('')
    const [preview, setPreview] = useState(null)

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        setUploading(true)
        setMessage('')

        try {
            const imageUrl = await uploadImage(file)
            setFormData(prev => ({
                ...prev,
                imageUrl: imageUrl
            }))
            setPreview(imageUrl)
            setMessage('✅ Imagen pre-cargada')
        } catch (error) {
            setMessage(`❌ Error: ${error.message}`);
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            await createPhoto(formData)
            setMessage('✅ Imagen cargada al sitio')
        } catch (error) {
            setMessage(`❌ Error: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <section className='min-h-screen text-white py-20 px-4'>
            <div className='max-w-2xl mx-auto'>
                {message && (
                    <div className='mb-6 p-4 rounded bg-gray-800 border border-gray-700'>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className='space-y-6'>
                    {/* Image Upload */}
                    <div>
                        <label className='block text-sm font-semibold mb-2'>Imagen</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploading}
                            id="photo-input"
                            className="hidden"
                        />
                        <label
                            htmlFor="photo-input"
                            className='w-full block bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white cursor-pointer text-center hover:bg-gray-800 transition'
                        >
                            {uploading ? 'Subiendo...' : 'Seleccionar imagen'}
                        </label>
                    </div>

                    {/* Preview */}
                    {preview && (
                        <div>
                            <p className='text-sm font-semibold mb-2'>Preview</p>
                            <img src={preview} alt="preview" className='w-full h-48 object-cover rounded' />
                        </div>
                    )}

                    {/* Title */}
                    <div>
                        <label className='block text-sm font-semibold mb-2'>Título</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder='Título de la foto...'
                            className='w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:border-blue-500 outline-none'
                            required
                        />
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

                    {/* Album */}
                    <div>
                        <label className='block text-sm font-semibold mb-2'>Álbum (opcional)</label>
                        <input
                            type="text"
                            name="album"
                            value={formData.album}
                            onChange={handleChange}
                            placeholder='Nombre del álbum...'
                            className='w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:border-blue-500 outline-none'
                        />
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={loading || !formData.imageUrl}
                        className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white font-bold py-3 rounded transition'
                    >
                        {loading ? 'Creando...' : 'Crear foto'}
                    </button>
                </form>
            </div>
        </section>
    )
}