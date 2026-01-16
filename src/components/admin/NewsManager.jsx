import { useState } from 'react';
import { useNews } from '../../hooks/useNews'
import { ListItem } from './ListItem';
import { NewsEditForm } from './NewsEditForm';

export function NewsManager() {
    const { news, loading, error, updateNews, deleteNews } = useNews()
    const [editingId, setEditingId] = useState(null)
    const [editData, setEditData] = useState(null)
    const [message, setMessage] = useState('')
    const [updating, setUpdating] = useState(false)

    const handleEdit = (item) => {
        setEditingId(item.id)
        setEditData({ ...item })
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