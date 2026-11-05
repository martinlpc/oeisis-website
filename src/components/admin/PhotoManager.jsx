import { useState } from 'react';
import { EMPTY_PHOTO, fieldChange } from './formState'
import { usePhotos } from '../../hooks/usePhotos';
import { useSupabaseStorage } from '../../hooks/useSupabaseStorage';
import { useToast, useConfirm } from './useFeedback';
import { ListItem, ListRow, EditActions } from './ListItem';
import { PhotoFields } from './PhotoEditForm';
import { StatusText } from './ui';

export function PhotoManager() {
    const { photos, loading, error, updatePhoto, deletePhoto } = usePhotos();
    const { removeByUrl } = useSupabaseStorage();
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState(null);
    const [saving, setSaving] = useState(false);
    const toast = useToast();
    const confirm = useConfirm();

    const startEdit = (photo) => {
        setEditingId(photo.id);
        setEditData({ ...EMPTY_PHOTO, title: photo.title || '', date: photo.date || '', album: photo.album || '', imageUrl: photo.imageUrl });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditData(null);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const { title, date, album } = editData;
            await updatePhoto(editingId, { title, date, album });
            toast.success('Foto actualizada');
            cancelEdit();
        } catch (error) {
            toast.error(`No se pudo guardar: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (photo) => {
        const ok = await confirm({ title: 'Eliminar foto', message: `"${photo.title}" se va a borrar del sitio y del almacenamiento.` });
        if (!ok) return;

        try {
            await deletePhoto(photo.id);
        } catch (error) {
            toast.error(`No se pudo eliminar: ${error.message}`);
            return;
        }

        try {
            await Promise.all([photo.imageUrl, photo.thumbUrl].filter(Boolean).map(url => removeByUrl(url)));
            toast.success('Foto eliminada');
        } catch (error) {
            toast.warning(`La foto se quitó del sitio, pero el archivo quedó en Supabase: ${error.message}`);
        }
    };

    if (loading) return <StatusText>Cargando fotos...</StatusText>;
    if (error) return <StatusText error>Error: {error}</StatusText>;
    if (photos.length === 0) return <StatusText>Todavía no hay fotos.</StatusText>;

    return (
        <ul className="space-y-3">
            {photos.map((photo) => (
                <ListRow key={photo.id} editing={editingId === photo.id}>
                    {editingId === photo.id ? (
                        <form onSubmit={handleSave} className="space-y-4">
                            <img src={editData.imageUrl} alt="" className="w-full max-h-56 object-contain bg-black rounded" />
                            <PhotoFields data={editData} onChange={fieldChange(setEditData)} />
                            <EditActions saving={saving} onCancel={cancelEdit} />
                        </form>
                    ) : (
                        <ListItem
                            title={photo.title}
                            meta={[photo.date, photo.album].filter(Boolean).join(' · ')}
                            thumbnail={photo.thumbUrl || photo.imageUrl}
                            onEdit={() => startEdit(photo)}
                            onDelete={() => handleDelete(photo)}
                        />
                    )}
                </ListRow>
            ))}
        </ul>
    );
}
