import { useState } from 'react';
import { EMPTY_VIDEO, fieldChange, isValidYouTube } from './formState'
import { useVideos } from '../../hooks/useVideos';
import { getThumbnailUrl } from '../../utils/youtube';
import { useToast, useConfirm } from './useFeedback';
import { ListItem, ListRow, EditActions } from './ListItem';
import { VideoFields } from './VideoEditForm';
import { Tag, StatusText } from './ui';
import { warnIfNotTranslated } from './englishFeedback';
import { EnglishPanel, EnglishTag } from './EnglishPanel';

export function VideoManager() {
    const { videos, loading, error, updateVideo, deleteVideo } = useVideos();
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState(null);
    const [saving, setSaving] = useState(false);
    const toast = useToast();
    const confirm = useConfirm();

    const startEdit = (video) => {
        setEditingId(video.id);
        setEditData({
            ...EMPTY_VIDEO,
            title: video.title || '',
            embedUrl: video.embedUrl || '',
            description: video.description || '',
            date: video.date || '',
            featured: Boolean(video.featured),
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditData(null);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!isValidYouTube(editData.embedUrl)) {
            toast.error('Revisá el link de YouTube');
            return;
        }
        setSaving(true);
        try {
            const result = await updateVideo(editingId, editData);
            toast.success('Video actualizado');
            warnIfNotTranslated(toast, result);
            cancelEdit();
        } catch (error) {
            toast.error(`No se pudo guardar: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (video) => {
        const ok = await confirm({ title: 'Eliminar video', message: `"${video.title}" se va a quitar del sitio. El video sigue en YouTube.` });
        if (!ok) return;
        try {
            await deleteVideo(video.id);
            toast.success('Video eliminado');
        } catch (error) {
            toast.error(`No se pudo eliminar: ${error.message}`);
        }
    };

    if (loading) return <StatusText>Cargando videos...</StatusText>;
    if (error) return <StatusText error>Error: {error}</StatusText>;
    if (videos.length === 0) return <StatusText>Todavía no hay videos.</StatusText>;

    return (
        <ul className="space-y-3">
            {videos.map((video) => (
                <ListRow key={video.id} editing={editingId === video.id}>
                    {editingId === video.id ? (
                        <form onSubmit={handleSave} className="space-y-4">
                            <VideoFields data={editData} onChange={fieldChange(setEditData)} />
                            <EnglishPanel key={video.enHash} collection="videos" item={video} path={['videos', video.id]} />
                            <EditActions saving={saving} onCancel={cancelEdit} />
                        </form>
                    ) : (
                        <ListItem
                            title={video.title}
                            meta={video.date}
                            text={video.description}
                            thumbnail={getThumbnailUrl(video.embedUrl, 'mqdefault')}
                            tags={<>{video.featured && <Tag>Destacado</Tag>}<EnglishTag collection="videos" item={video} /></>}
                            onEdit={() => startEdit(video)}
                            onDelete={() => handleDelete(video)}
                        />
                    )}
                </ListRow>
            ))}
        </ul>
    );
}
