import { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useCloudinaryUpload } from '../../hooks/useCloudinaryUpload'

export function NewsForm() {
    const { uploadImage } = useCloudinaryUpload()

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        featured: false
    })

    const [images, setImages] = useState([])
    const [uploading, setUploading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }))
    }

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files)
        setUploading(true)

        try {
            for (const file of files) {
                const url = await uploadImage(file)
                setImages(prev => [...prev, url])
            }
            setMessage(`✅ ${files.length} imagen(es) subida(s)`)
        } catch (error) {
            setMessage(`❌ Error: ${error.message}`)
        } finally {
            setUploading(false)
        }
    }

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        try {
            const docData = {
                title: formData.title,
                content: formData.content,
                images: images,
                date: new Date().toLocaleDateString('es-AR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                }),
                featured: formData.featured,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            }

            await addDoc(collection(db, 'news'), docData)
            setMessage('✅ Noticia creada')

            setFormData({
                title: '',
                content: '',
                featured: false
            })
            setImages([])
        } catch (error) {
            console.error(`Error: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className='min-h-screen text-white py-10 px-4 flex items-center justify-center'>
            <div className='max-w-2xl mx-auto'>
                {/* <h2 className='text-4xl font-bold mb-8 text-center'>Admin - Crear Noticia</h2> */}
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
                            placeholder='Título de la noticia...'
                            className='w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:border-blue-500 outline-none'
                            required
                        />
                    </div>

                    {/* Content/text */}
                    <div>
                        <label className='block text-sm font-semibold mb-2'>Contenido</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder='Texto de la noticia...'
                            rows="6"
                            className='w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:border-blue-500 outline-none'
                            required
                        />
                    </div>

                    {/* Images */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">Imágenes</label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploading}
                            className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white"
                        />
                        {uploading && <p className='text-blue-400 mt-2'>Subiendo imágenes...</p>}
                        {images.length > 0 && (
                            <div className='mt-4 grid grid-cols-3 gap-4'>
                                {images.map((url, index) => (
                                    <div key={index} className='relative'>
                                        <img src={url} alt={`preview-${index}`} className='w-full h-24 object-cover rounded' />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className='absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm'
                                        >
                                            x
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Featured */}
                    <div>
                        <label className='flex items-center'>
                            <input
                                type="checkbox"
                                name="featured"
                                checked={formData.featured}
                                onChange={handleChange}
                                className='w-4 h-4 mr-2'
                            />
                            <span className='text-sm font-semibold'>Destacar en la portada</span>
                        </label>
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white font-bold py-3 rounded transition'
                    >
                        {loading ? 'Creando...' : 'Crear noticia'}
                    </button>
                </form>
            </div>

        </section>
    )
}