import { useState } from 'react';
import { usePhotos } from '../../hooks/usePhotos';
import { ListItem } from './ListItem';
import { PhotoEditForm } from './PhotoEditForm';

export function PhotoManager() {
    const { photos, loading, error, updatePhoto, deletePhoto } = usePhotos();
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState(null);
    const [message, setMessage] = useState('');
    const [updating, setUpdating] = useState(false);

    const handleEdit = (photo) => {
        setEditingId(photo.id);
        setEditData({ ...photo });
    };

    const handleDataChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        setUpdating(true);
        setMessage('');

        try {
            const { id, ...dataToUpdate } = editData;
            await updatePhoto(id, dataToUpdate);
            setMessage('✅ Foto actualizada');
            setEditingId(null);
            setEditData(null);
        } catch (error) {
            setMessage(`❌ Error: ${error.message}`);
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de que querés eliminar esta foto?')) return;

        try {
            await deletePhoto(id);
            setMessage('✅ Foto eliminada');
        } catch (error) {
            setMessage(`❌ Error: ${error.message}`);
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditData(null);
    };

    if (loading) {
        return <p className="text-gray-400">Cargando fotos...</p>;
    }

    if (error) {
        return <p className="text-red-500">Error: {error}</p>;
    }

    if (photos.length === 0) {
        return <p className="text-gray-400">No hay fotos aún</p>;
    }

    return (
        <div>
            {message && (
                <div className="mb-6 p-4 rounded bg-gray-800 border border-gray-700">
                    {message}
                </div>
            )}

            <div className="space-y-4">
                {photos.map((photo) => (
                    <div key={photo.id} className="border border-gray-700 rounded-lg p-4">
                        {editingId === photo.id ? (
                            <PhotoEditForm
                                editData={editData}
                                updating={updating}
                                onSave={handleSave}
                                onCancel={handleCancel}
                                onDataChange={handleDataChange}
                            />
                        ) : (
                            <ListItem
                                item={photo}
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