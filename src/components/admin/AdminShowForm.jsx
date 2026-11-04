import { useState } from 'react';
import { EMPTY_SHOW, fieldChange } from './formState'
import { createShow } from '../../hooks/useShows';
import { useToast } from './useFeedback';
import { Button } from './ui';
import { ShowFields } from './ShowEditForm';

export function AdminShowForm() {
    const [formData, setFormData] = useState(EMPTY_SHOW);
    const [saving, setSaving] = useState(false);
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await createShow(formData);
            toast.success(`Show "${formData.title}" creado`);
            setFormData(EMPTY_SHOW);
        } catch (error) {
            toast.error(`No se pudo crear el show: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <ShowFields data={formData} onChange={fieldChange(setFormData)} />
            <Button type="submit" disabled={saving} className="w-full py-3">
                {saving ? 'Creando...' : 'Crear show'}
            </Button>
        </form>
    );
}
