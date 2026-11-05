import { useState } from 'react';
import { EMPTY_VIDEO, fieldChange, isValidYouTube } from './formState'
import { createVideo } from '../../hooks/useVideos';
import { useToast } from './useFeedback';
import { Button } from './ui';
import { VideoFields } from './VideoEditForm';
import { warnIfNotTranslated } from './englishFeedback';

export function VideoForm() {
    const [formData, setFormData] = useState(EMPTY_VIDEO);
    const [saving, setSaving] = useState(false);
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValidYouTube(formData.embedUrl)) {
            toast.error('Revisá el link de YouTube');
            return;
        }
        setSaving(true);
        try {
            const result = await createVideo(formData);
            toast.success(`Video "${formData.title}" agregado`);
            warnIfNotTranslated(toast, result);
            setFormData(EMPTY_VIDEO);
        } catch (error) {
            toast.error(`No se pudo agregar el video: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <VideoFields data={formData} onChange={fieldChange(setFormData)} />
            <Button type="submit" disabled={saving} className="w-full py-3">
                {saving ? 'Agregando...' : 'Agregar video'}
            </Button>
        </form>
    );
}
