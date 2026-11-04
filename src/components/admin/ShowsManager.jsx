import { useState, useEffect } from 'react';
import { useShows, formatDisplayDate, getShowISO, isPastShow } from '../../hooks/useShows'
import { ListItem } from './ListItem';
import { ShowEditForm } from './ShowEditForm';

export function ShowsManager() {
    const { shows, loading, error, updateShow, deleteShow } = useShows()
    const [editingId, setEditingId] = useState(null)
    const [editData, setEditData] = useState(null)
    const [message, setMessage] = useState('')
    const [updating, setUpdating] = useState(false)

    // Migración: completa dateISO en los shows creados antes de que existiera el campo
    useEffect(() => {
        shows
            .filter(show => !show.dateISO && getShowISO(show))
            .forEach(show => {
                updateShow(show.id, { dateISO: getShowISO(show) })
                    .catch(err => console.error('No se pudo migrar dateISO', show.id, err))
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shows])

    const handleEdit = (show) => {
        setEditingId(show.id)

        const dateValue = getShowISO(show) || ''

        setEditData({
            ...show,
            date: dateValue
        })
    }

    const handleDataChange = (e) => {
        const { name, value, type, checked } = e.target
        setEditData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
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
            dataToUpdate.dateISO = dataToUpdate.date
            dataToUpdate.date = formatDisplayDate(dataToUpdate.date)
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
        return (
            <div>
                {message && (
                    <div className="mb-6 p-4 rounded bg-gray-800 border border-gray-700">
                        {message}
                    </div>
                )}
                <p className="text-gray-400">No hay shows aún</p>
            </div>
        )
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
                    <div key={show.id} className={`border border-gray-700 rounded-lg p-4 ${isPastShow(show) && editingId !== show.id ? 'opacity-60' : ''}`}>
                        {isPastShow(show) && (
                            <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">Pasado (no se muestra en la web)</p>
                        )}
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