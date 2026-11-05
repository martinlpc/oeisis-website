import { useState, useEffect, useRef } from "react";
import { fieldChange, isValidYouTube } from './formState'
import { useFeatured } from "../../hooks/useFeatured";
import { useSupabaseStorage } from "../../hooks/useSupabaseStorage";
import { useToast } from "./useFeedback";
import { Button, Field, FilePicker, inputClass } from "./ui";
import { YouTubeField } from "./YouTubeField";
import { warnIfNotTranslated } from "./englishFeedback";
import { EnglishPanel } from "./EnglishPanel";

const EMPTY = { type: 'show', title: '', description: '', image: '', videoUrl: '' };

export function FeaturedForm() {
    const { featured, loading, updateFeatured } = useFeatured();
    const { upload, removeByUrl } = useSupabaseStorage();
    const toast = useToast();
    const [formData, setFormData] = useState(EMPTY);
    const [ctas, setCtas] = useState([]);
    const [newCta, setNewCta] = useState({ label: '', url: '' });
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showUrlInput, setShowUrlInput] = useState(false);

    // Imagen subida en esta sesión y todavía no guardada
    const pendingRef = useRef(null);

    // Carga los datos guardados (y los recarga si cambian en Firestore)
    useEffect(() => {
        if (!featured) return;
        setFormData({
            type: featured.type || 'show',
            title: featured.title || '',
            description: featured.description || '',
            image: featured.image || '',
            videoUrl: featured.videoUrl || '',
        });
        setCtas(featured.ctas || []);
    }, [featured]);

    useEffect(() => {
        return () => {
            if (pendingRef.current) removeByUrl(pendingRef.current).catch(() => {});
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = fieldChange(setFormData);

    const discardPending = () => {
        if (pendingRef.current) removeByUrl(pendingRef.current).catch(() => {});
        pendingRef.current = null;
    };

    const handleImageFiles = async ([file]) => {
        discardPending();
        setUploading(true);
        try {
            const { url } = await upload(file);
            pendingRef.current = url;
            setFormData(prev => ({ ...prev, image: url }));
        } catch (error) {
            toast.error(`No se pudo subir la imagen: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    const removeImage = () => {
        discardPending();
        setFormData(prev => ({ ...prev, image: '' }));
    };

    const addCta = () => {
        if (!newCta.label || !newCta.url) return;
        setCtas(prev => [...prev, { ...newCta }]);
        setNewCta({ label: '', url: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.type === 'video' && !isValidYouTube(formData.videoUrl)) {
            toast.error('Para un destacado de tipo video hace falta un link de YouTube válido');
            return;
        }
        setSaving(true);
        try {
            const previousImage = featured?.image;
            const result = await updateFeatured({ ...formData, ctas }, featured?.id || 'current');
            pendingRef.current = null;
            // La imagen anterior ya no se usa: se borra si era de Supabase
            if (previousImage && previousImage !== formData.image) {
                removeByUrl(previousImage).catch(() => {});
            }
            toast.success('Destacado actualizado');
            warnIfNotTranslated(toast, result);
        } catch (error) {
            toast.error(`No se pudo guardar: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p className="text-gray-400">Cargando...</p>;

    const isVideo = formData.type === 'video';

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Field label="Tipo" hint="Define el título de la sección en el sitio: Próximamente, Nuevo video, Novedades o Destacado.">
                <select name="type" value={formData.type} onChange={handleChange} className={inputClass}>
                    <option value="show">Show</option>
                    <option value="video">Video</option>
                    <option value="news">Noticia</option>
                    <option value="custom">Personalizado</option>
                </select>
            </Field>

            <Field label="Título">
                <input name="title" value={formData.title} onChange={handleChange} required className={inputClass} />
            </Field>

            <Field label="Descripción">
                <textarea name="description" value={formData.description} onChange={handleChange} rows={4} required className={inputClass} />
            </Field>

            {isVideo ? (
                <YouTubeField name="videoUrl" value={formData.videoUrl} onChange={handleChange} required />
            ) : (
                <div>
                    <span className="block text-xs uppercase tracking-widest text-gray-400 mb-1.5">Imagen</span>
                    {formData.image ? (
                        <div className="space-y-2">
                            <img src={formData.image} alt="" className="w-full max-h-72 object-contain bg-black rounded" />
                            <div className="flex gap-2">
                                <FilePickerButton uploading={uploading} onFiles={handleImageFiles} />
                                <Button variant="danger" onClick={removeImage}>Quitar imagen</Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <FilePicker id="featured-image" label="Subir imagen (flyer, foto)" uploading={uploading} onFiles={handleImageFiles} />
                            {showUrlInput ? (
                                <input type="url" name="image" value={formData.image} onChange={handleChange} className={`${inputClass} mt-2`} placeholder="https://..." />
                            ) : (
                                <button type="button" onClick={() => setShowUrlInput(true)} className="mt-2 text-xs text-gray-400 underline hover:text-white">
                                    o pegar el link de una imagen
                                </button>
                            )}
                        </>
                    )}
                </div>
            )}

            <div>
                <span className="block text-xs uppercase tracking-widest text-gray-400 mb-1.5">Botones</span>
                {ctas.length > 0 && (
                    <ul className="space-y-2 mb-3">
                        {ctas.map((cta, index) => (
                            <li key={`${cta.url}-${index}`} className="flex items-center gap-3 border border-white/10 rounded px-3 py-2">
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm">{cta.label}</p>
                                    <p className="text-xs text-gray-400 truncate">{cta.url}</p>
                                </div>
                                <Button variant="danger" onClick={() => setCtas(prev => prev.filter((_, i) => i !== index))}>Quitar</Button>
                            </li>
                        ))}
                    </ul>
                )}
                <div className="grid sm:grid-cols-[1fr_1.5fr_auto] gap-2">
                    <input value={newCta.label} onChange={(e) => setNewCta(prev => ({ ...prev, label: e.target.value }))} className={inputClass} placeholder="Texto (ej: Comprar entradas)" aria-label="Texto del botón" />
                    <input type="url" value={newCta.url} onChange={(e) => setNewCta(prev => ({ ...prev, url: e.target.value }))} className={inputClass} placeholder="https://" aria-label="Link del botón" />
                    <Button variant="secondary" onClick={addCta} disabled={!newCta.label || !newCta.url}>Agregar</Button>
                </div>
            </div>

            <Button type="submit" disabled={saving || uploading} className="w-full py-3">
                {saving ? 'Guardando...' : 'Guardar destacado'}
            </Button>

            {featured && <EnglishPanel key={featured.enHash} collection="featured" item={featured} path={['featured', featured.id]} />}
        </form>
    );
}

// Variante chica del selector para reemplazar una imagen existente
function FilePickerButton({ uploading, onFiles }) {
    return (
        <label className={`px-4 py-2 rounded font-semibold text-sm border border-white/20 ${uploading ? 'opacity-50' : 'cursor-pointer hover:bg-white/10'}`}>
            {uploading ? 'Subiendo...' : 'Reemplazar'}
            <input
                type="file"
                accept="image/*"
                className="sr-only"
                disabled={uploading}
                onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    e.target.value = '';
                    if (files.length) onFiles(files);
                }}
            />
        </label>
    );
}
