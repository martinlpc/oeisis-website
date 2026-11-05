import { useState } from 'react';
import { EMPTY_SHOW, fieldChange } from './formState'
import { createShow } from '../../hooks/useShows';
import { useToast } from './useFeedback';
import { Button } from './ui';
import { ShowFields } from './ShowEditForm';
import { isValidTimeZone } from '../../utils/timezones';
import { useTrackedUploads } from './useTrackedUploads';
import { makeOgImage } from '../../utils/ogImage';
import { warnIfNotTranslated } from './englishFeedback';

export function AdminShowForm() {
    const [formData, setFormData] = useState(EMPTY_SHOW);
    const [saving, setSaving] = useState(false);
    const toast = useToast();
    const files = useTrackedUploads();

    // El flyer se guarda como JPEG de 1200 px: sirve para la página y para la vista previa en redes
    const handleFlyerFiles = async ([file]) => {
        try {
            const url = await files.uploadFile(file, { compressOptions: { type: 'image/jpeg', maxSize: 1200 } });
            // Versión 1200x630 para la vista previa en redes (el flyer entero sobre fondo desenfocado)
            const ogUrl = await files.uploadFile(await makeOgImage(file), { compress: false });
            files.drop(formData.flyer);
            files.drop(formData.flyerOg);
            setFormData(prev => ({ ...prev, flyer: url, flyerOg: ogUrl }));
        } catch (error) {
            toast.error(`No se pudo subir el flyer: ${error.message}`);
        }
    };

    const removeFlyer = () => {
        files.drop(formData.flyer);
        files.drop(formData.flyerOg);
        setFormData(prev => ({ ...prev, flyer: '', flyerOg: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValidTimeZone(formData.timeZone)) {
            toast.error('Revisá la zona horaria');
            return;
        }
        setSaving(true);
        try {
            const result = await createShow(formData);
            files.commit();
            toast.success(`Show "${formData.title}" creado`);
            warnIfNotTranslated(toast, result);
            setFormData(EMPTY_SHOW);
        } catch (error) {
            toast.error(`No se pudo crear el show: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <ShowFields
                data={formData}
                onChange={fieldChange(setFormData)}
                flyerUploading={files.uploading}
                onFlyerFiles={handleFlyerFiles}
                onFlyerRemove={removeFlyer}
            />
            <Button type="submit" disabled={saving || files.uploading} className="w-full py-3">
                {saving ? 'Creando...' : 'Crear show'}
            </Button>
        </form>
    );
}
