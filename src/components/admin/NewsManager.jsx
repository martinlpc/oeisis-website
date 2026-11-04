import { useState, useRef } from 'react';
import { EMPTY_NEWS, fieldChange, isValidYouTube } from './formState'
import { useNews } from '../../hooks/useNews';
import { useSupabaseStorage } from '../../hooks/useSupabaseStorage';
import { getThumbnailUrl } from '../../utils/youtube';
import { useToast, useConfirm } from './useFeedback';
import { ListItem, ListRow, EditActions } from './ListItem';
import { NewsFields } from './NewsEditForm';
import { Tag, StatusText } from './ui';

export function NewsManager() {
    const { news, loading, error, updateNews, deleteNews } = useNews();
    const { upload, removeByUrl } = useSupabaseStorage();
    const toast = useToast();
    const confirm = useConfirm();
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState(null);
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Imágenes quitadas en el formulario: se borran del bucket recién al guardar
    const removedRef = useRef([]);
    // Imágenes subidas en esta edición: se borran si se cancela
    const uploadedRef = useRef([]);

    const startEdit = (item) => {
        setEditingId(item.id);
        setEditData({
            ...EMPTY_NEWS,
            type: item.type || 'news',
            title: item.title || '',
            content: item.content || '',
            externalLink: item.externalLink || '',
            featured: Boolean(item.featured),
        });
        setImages(item.images || []);
        removedRef.current = [];
        uploadedRef.current = [];
    };

    const cancelEdit = () => {
        uploadedRef.current.forEach(url => removeByUrl(url).catch(() => {}));
        uploadedRef.current = [];
        removedRef.current = [];
        setEditingId(null);
        setEditData(null);
    };

    const handleImageFiles = async (files) => {
        setUploading(true);
        try {
            for (const file of files) {
                const { url } = await upload(file);
                uploadedRef.current.push(url);
                setImages(prev => [...prev, url]);
            }
        } catch (error) {
            toast.error(`No se pudo subir una imagen: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index) => {
        removedRef.current.push(images[index]);
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const isInterview = editData.type === 'interview';
        if (isInterview && editData.externalLink && !isValidYouTube(editData.externalLink)) {
            toast.error('Revisá el link de YouTube');
            return;
        }
        setSaving(true);
        try {
            await updateNews(editingId, {
                ...editData,
                externalLink: isInterview ? editData.externalLink : '',
                images: isInterview ? [] : images,
            });
            // Al pasar a entrevista, las imágenes que tenía dejan de usarse
            const toRemove = isInterview ? [...removedRef.current, ...images] : removedRef.current;
            toRemove.forEach(url => removeByUrl(url).catch(() => {}));
            uploadedRef.current = [];
            removedRef.current = [];
            toast.success('Noticia actualizada');
            setEditingId(null);
            setEditData(null);
        } catch (error) {
            toast.error(`No se pudo guardar: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (item) => {
        const ok = await confirm({ title: 'Eliminar noticia', message: `"${item.title}" y sus imágenes se van a borrar del sitio.` });
        if (!ok) return;

        try {
            await deleteNews(item.id);
        } catch (error) {
            toast.error(`No se pudo eliminar: ${error.message}`);
            return;
        }

        try {
            await Promise.all((item.images || []).map(url => removeByUrl(url)));
            toast.success('Noticia eliminada');
        } catch (error) {
            toast.warning(`La noticia se quitó del sitio, pero quedaron archivos en Supabase: ${error.message}`);
        }
    };

    if (loading) return <StatusText>Cargando noticias...</StatusText>;
    if (error) return <StatusText error>Error: {error}</StatusText>;
    if (news.length === 0) return <StatusText>Todavía no hay noticias.</StatusText>;

    return (
        <ul className="space-y-3">
            {news.map((item) => (
                <ListRow key={item.id} editing={editingId === item.id}>
                    {editingId === item.id ? (
                        <form onSubmit={handleSave} className="space-y-4">
                            <NewsFields
                                idPrefix={`edit-${item.id}`}
                                data={editData}
                                onChange={fieldChange(setEditData)}
                                images={images}
                                uploading={uploading}
                                onImageFiles={handleImageFiles}
                                onRemoveImage={removeImage}
                            />
                            <EditActions saving={saving || uploading} onCancel={cancelEdit} />
                        </form>
                    ) : (
                        <ListItem
                            title={item.title}
                            meta={item.date}
                            text={item.content}
                            thumbnail={item.images?.[0] || getThumbnailUrl(item.externalLink, 'mqdefault')}
                            tags={
                                <>
                                    <Tag tone="muted">{item.type === 'interview' ? 'Entrevista' : 'Noticia'}</Tag>
                                    {item.featured && <Tag>Destacada</Tag>}
                                </>
                            }
                            onEdit={() => startEdit(item)}
                            onDelete={() => handleDelete(item)}
                        />
                    )}
                </ListRow>
            ))}
        </ul>
    );
}
