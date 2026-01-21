import { useState } from 'react';
import { useNews } from '../../hooks/useNews'
import { ListItem } from './ListItem';
import { NewsEditForm } from './NewsEditForm';
import { useCloudinaryUpload } from '../../hooks/useCloudinaryUpload'

export function NewsManager() {
    const { news, loading, error, updateNews, deleteNews } = useNews()
    const [editingId, setEditingId] = useState(null)
    const [editData, setEditData] = useState(null)
    const [message, setMessage] = useState('')
    const [updating, setUpdating] = useState(false)
    const [images, setImages] = useState([])
    const [uploading, setUploading] = useState(false)
    const { uploadImage } = useCloudinaryUpload()

    const handleEdit = (item) => {
        setEditingId(item.id)
        setEditData({ ...item })
        setImages(item.images || [])
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setEditData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }))
    }

    const handleSave = async () => {
        setUpdating(true)
        setMessage('')

        try {
            const { id, ...dataToUpdate } = editData
            dataToUpdate.images = images
            await updateNews(id, dataToUpdate)
            setMessage('✅ Noticia actualizada')
            setEditingId(null)
            setEditData(null)
        } catch (error) {
            setMessage(`❌ Error: ${error.message}`)
        } finally {
            setUpdating(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de que querés eliminar esta noticia?')) return

        try {
            await deleteNews(id)
            setMessage('✅ Noticia eliminada')
        } catch (error) {
            setMessage(`❌ Error: ${error.message}`)
        }
    }

    const handleCancel = () => {
        setEditingId(null)
        setEditData(null)
    }

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        setUploading(true);

        try {
            for (const file of files) {
                const url = await uploadImage(file);
                setImages(prev => [...prev, url]);
            }
        } catch (error) {
            setMessage(`❌ Error: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };


    if (loading) {
        return <p className="text-gray-400">Cargando noticias...</p>
    }

    if (error) {
        return <p className="text-red-500">Error: {error}</p>
    }

    if (news.length === 0) {
        return <p className="text-gray-400">No hay shows aún</p>
    }

    return (
        <div>
            {message && (
                <div className="mb-6 p-4 rounded bg-gray-800 border border-gray-700">
                    {message}
                </div>
            )}

            <div className="space-y-4">
                {news.map((item) => (
                    <div key={item.id} className="border border-gray-700 rounded-lg p-4">
                        {editingId === item.id ? (
                            <NewsEditForm
                                editData={editData}
                                updating={updating}
                                onSave={handleSave}
                                onCancel={handleCancel}
                                onDataChange={handleChange}
                                onImageUpload={handleImageUpload}
                                uploading={uploading}
                                images={images}
                                onRemoveImage={handleRemoveImage}
                            />
                        ) : (
                            <ListItem
                                item={item}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}