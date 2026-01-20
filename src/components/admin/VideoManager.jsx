import { useState } from "react"
import { useVideos } from "../../hooks/useVideos"
import { ListItem } from "./ListItem"
import { VideoEditForm } from "./VideoEditForm"

export function VideoManager() {
    const { videos, loading, error, updateVideo, deleteVideo } = useVideos()
    const [editingId, setEditingId] = useState(null)
    const [editData, setEditData] = useState(null)
    const [message, setMessage] = useState('')
    const [updating, setUpdating] = useState(false)

    const handleEdit = (video) => {
        setEditingId(video.id)
        setEditData({ ...video })
    }

    const handleDataChange = (e) => {
        const { name, value, type, checked } = e.target
        setEditData(prev => ({
            ...prev,
            [name]: type === 'checkbok' ? checked : value
        }))
    }

    const handleSave = async () => {
        setUpdating(true)
        setMessage('')

        try {
            const { id, ...dataToUpdate } = editData
            await updateVideo(id, dataToUpdate)
            setMessage('✅ Video actualizado')
            setEditingId(null)
            setEditData(null)
        } catch (error) {
            setMessage(`❌ Error: ${error.message}`)
        } finally {
            setUpdating(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de que querés eliminar este video?')) return

        try {
            await deleteVideo(id)
            setMessage('✅ Video eliminado')
        } catch (error) {
            setMessage(`❌ Error: ${error.message}`)
        }
    }

    const handleCancel = () => {
        setEditingId(null)
        setEditData(null)
    }

    if (loading) {
        return <p className="text-gray-400">"Need a little time to load the videos..."</p>
    }

    if (error) {
        return <p className="text-red-500">Error: {error}</p>
    }

    if (videos.length === 0) {
        return <p className="text-gray-400">No hay videos para mostrar (aun!)</p>
    }

    return (
        <div>
            {message && (
                <div className="mb-6 p-4 rounded bg-gray-800 border border-gray-700">
                    {message}
                </div>
            )}

            <div className="space-y-4">
                {videos.map((video) => (
                    <div key={video.id} className="border border-gray-700 rounded-lg p-4">
                        {editingId === video.id ? (
                            <VideoEditForm
                                editData={editData}
                                updating={updating}
                                onSave={handleSave}
                                onCancel={handleCancel}
                                onDataChange={handleDataChange}
                            />
                        ) : (
                            <ListItem
                                item={video}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>

    )
}