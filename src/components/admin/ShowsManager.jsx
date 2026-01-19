import { useState } from 'react';
import { useShows } from '../../hooks/useShows'
import { ListItem } from './ListItem';
import { ShowEditForm } from './ShowEditForm';

export function ShowsManager() {
    const { shows, loading, error, updateShow, deleteShow, formatDateFromInput, formatDateToInput } = useShows()
    const [editingId, setEditingId] = useState(null)
    const [editData, setEditData] = useState(null)
    const [message, setMessage] = useState('')
    const [updating, setUpdating] = useState(false)

    const handleEdit = (show) => {
        setEditingId(show.id)

        // Convertir fecha de "09 ene 2026" a "2026-01-09" para el input
        const dateValue = formatDateToInput(show.date)

        setEditData({
            ...show,
            date: dateValue
        })
    }

    const handleDataChange = (e) => {
        const { name, value } = e.target
        setEditData(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleLocationChange = (field, value) => {
        setEditData(prev => ({
            ...prev,
            location: {
                ...prev.location,
                [field]: value,
            },
        }))
    }

    const handleSave = async () => {
        setUpdating(true)
        setMessage('')

        try {
            const { id, ...dataToUpdate } = editData
            dataToUpdate.date = formatDateFromInput(dataToUpdate.date)
            await updateShow(id, dataToUpdate)
            setMessage('✅ Show actualizado')
            setEditingId(null)
            setEditData(null)
        } catch (error) {
            setMessage(`❌ Error: ${error.message}`)
        } finally {
            setUpdating(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de que querés eliminar este show?')) return

        try {
            await deleteShow(id)
            setMessage('✅ Show eliminado')
        } catch (error) {
            setMessage(`❌ Error: ${error.message}`)
        }
    }

    const handleCancel = () => {
        setEditingId(null)
        setEditData(null)
    }

    if (loading) {
        return <p className="text-gray-400">Cargando shows...</p>
    }

    if (error) {
        return <p className="text-red-500">Error: {error}</p>
    }

    if (shows.length === 0) {
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
                {shows.map((show) => (
                    <div key={show.id} className="border border-gray-700 rounded-lg p-4">
                        {editingId === show.id ? (
                            <ShowEditForm
                                editData={editData}
                                updating={updating}
                                onSave={handleSave}
                                onCancel={handleCancel}
                                onLocationChange={handleLocationChange}
                                onDataChange={handleDataChange}
                            />
                        ) : (
                            <ListItem
                                item={show}
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