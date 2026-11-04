import { useState, useEffect } from 'react';
import { EMPTY_SHOW, fieldChange } from './formState'
import { useShows, formatDisplayDate, getShowISO, isPastShow } from '../../hooks/useShows';
import { useToast, useConfirm } from './useFeedback';
import { ListItem, ListRow, EditActions } from './ListItem';
import { ShowFields } from './ShowEditForm';
import { Tag, StatusText } from './ui';
import { DEFAULT_TIME_ZONE, isValidTimeZone } from '../../utils/timezones';
import { formatShowTime } from '../../utils/showDetails';
import { useTrackedUploads } from './useTrackedUploads';
import { useSupabaseStorage } from '../../hooks/useSupabaseStorage';

// Documento de Firestore -> estado plano del formulario
const toForm = (show) => ({
    ...EMPTY_SHOW,
    title: show.title || '',
    date: getShowISO(show) || '',
    time: show.time || '',
    venue: show.location?.venue || '',
    address: show.location?.address || '',
    city: show.location?.city || '',
    province: show.location?.province || '',
    country: show.location?.country || '',
    timeZone: show.timeZone || DEFAULT_TIME_ZONE,
    ticketLink: show.ticketLink || '',
    freeEntry: Boolean(show.freeEntry),
    description: show.description || '',
    flyer: show.flyer || '',
});

// Estado plano -> campos a actualizar en Firestore
const toUpdate = (form) => ({
    title: form.title,
    date: formatDisplayDate(form.date),
    dateISO: form.date,
    time: form.time,
    timeZone: form.timeZone,
    location: {
        venue: form.venue,
        address: form.address,
        city: form.city,
        province: form.province,
        country: form.country,
    },
    ticketLink: form.ticketLink,
    freeEntry: form.freeEntry,
    description: form.description,
    flyer: form.flyer,
});

export function ShowsManager() {
    const { shows, loading, error, updateShow, deleteShow } = useShows();
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState(null);
    const [saving, setSaving] = useState(false);
    const toast = useToast();
    const confirm = useConfirm();
    const files = useTrackedUploads();
    const { removeByUrl } = useSupabaseStorage();

    // Migración: completa dateISO en los shows creados antes de que existiera el campo
    useEffect(() => {
        shows
            .filter(show => !show.dateISO && getShowISO(show))
            .forEach(show => {
                updateShow(show.id, { dateISO: getShowISO(show) })
                    .catch(err => console.error('No se pudo migrar dateISO', show.id, err));
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shows]);

    const startEdit = (show) => {
        setEditingId(show.id);
        setEditData(toForm(show));
    };

    const cancelEdit = () => {
        files.rollback();
        setEditingId(null);
        setEditData(null);
    };

    const handleFlyerFiles = async ([file]) => {
        try {
            const url = await files.uploadFile(file, { compressOptions: { type: 'image/jpeg', maxSize: 1200 } });
            files.drop(editData.flyer);
            setEditData(prev => ({ ...prev, flyer: url }));
        } catch (error) {
            toast.error(`No se pudo subir el flyer: ${error.message}`);
        }
    };

    const removeFlyer = () => {
        files.drop(editData.flyer);
        setEditData(prev => ({ ...prev, flyer: '' }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!isValidTimeZone(editData.timeZone)) {
            toast.error('Revisá la zona horaria');
            return;
        }
        setSaving(true);
        try {
            await updateShow(editingId, toUpdate(editData));
            files.commit();
            toast.success('Show actualizado');
            setEditingId(null);
            setEditData(null);
        } catch (error) {
            toast.error(`No se pudo guardar: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (show) => {
        const ok = await confirm({
            title: 'Eliminar show',
            message: `"${show.title}" (${show.date}) se va a borrar del sitio.`,
        });
        if (!ok) return;
        try {
            await deleteShow(show.id);
            if (show.flyer) removeByUrl(show.flyer).catch(() => {});
            toast.success('Show eliminado');
        } catch (error) {
            toast.error(`No se pudo eliminar: ${error.message}`);
        }
    };

    if (loading) return <StatusText>Cargando shows...</StatusText>;
    if (error) return <StatusText error>Error: {error}</StatusText>;
    if (shows.length === 0) return <StatusText>Todavía no hay shows.</StatusText>;

    return (
        <ul className="space-y-3">
            {shows.map((show) => {
                const past = isPastShow(show);
                const { venue, city } = show.location || {};
                return (
                    <ListRow key={show.id} editing={editingId === show.id} dimmed={past}>
                        {editingId === show.id ? (
                            <form onSubmit={handleSave} className="space-y-4">
                                <ShowFields
                                    data={editData}
                                    onChange={fieldChange(setEditData)}
                                    flyerUploading={files.uploading}
                                    onFlyerFiles={handleFlyerFiles}
                                    onFlyerRemove={removeFlyer}
                                />
                                <EditActions saving={saving || files.uploading} onCancel={cancelEdit} />
                            </form>
                        ) : (
                            <ListItem
                                title={show.title}
                                meta={[show.date, formatShowTime(show), [venue, city].filter(Boolean).join(', ')].filter(Boolean).join(' · ')}
                                tags={(past || show.freeEntry || !show.ticketLink) && (
                                    <>
                                        {past && <Tag tone="muted">Pasado, no se muestra</Tag>}
                                        {show.freeEntry && <Tag>Entrada libre</Tag>}
                                        {!show.freeEntry && !show.ticketLink && !past && <Tag tone="muted">Sin link de entradas</Tag>}
                                    </>
                                )}
                                onEdit={() => startEdit(show)}
                                onDelete={() => handleDelete(show)}
                            />
                        )}
                    </ListRow>
                );
            })}
        </ul>
    );
}
