import { useState } from 'react';
import { useShows } from '../hooks/useShows';
import { ShowListItem } from './ShowListItem';
import { ShowEditForm } from './ShowEditForm';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export function ShowsManager() {
    const { shows, loading, error } = useShows()
    const [editingId, setEditingId] = useState(null)
    const [editData, setEditData] = useState(null)
    const [message, setMessage] = useState('')
    const [updating, setUpdating] = useState(false)

    const handleEdit = (show) => {
        setEditingId(show.id)

        // Convertir fecha de "09 ene 2026" a "2026-01-09" para el input
        let dateValue = show.date;

        if (show.date && typeof show.date === 'string') {
            try {
                const months = {
                    ene: '01', feb: '02', mar: '03', abr: '04', may: '05', jun: '06',
                    jul: '07', ago: '08', sep: '09', oct: '10', nov: '11', dic: '12'
                };
                const parts = show.date.split(' ').filter(p => p !== 'de');
                const day = parts[0].padStart(2, '0');
                const month = months[parts[1]];
                const year = parts[2];

                if (month && year) {
                    dateValue = `${year}-${month}-${day}`;
                }

            } catch (e) {
                console.error('Error converting date:', e);
            }
        }

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

            // Convertir fecha de vuelta a "09 ene 2026"
            let dateValue = dataToUpdate.date;
            if (dataToUpdate.date && dataToUpdate.date.includes('-')) {
                const date = new Date(dataToUpdate.date + 'T00:00:00');
                dateValue = date.toLocaleDateString('es-AR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                }).replace(/ de /g, ' ') // Elimina 'de' entre los digitos de la fecha
            }

            dataToUpdate.date = dateValue;

            await updateDoc(doc(db, 'shows', id), dataToUpdate)
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
            await deleteDoc(doc(db, 'shows', id))
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
                            <ShowListItem
                                show={show}
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