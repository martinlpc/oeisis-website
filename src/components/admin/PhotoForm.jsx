import { useState, useRef, useEffect } from 'react'
import { EMPTY_PHOTO, fieldChange } from './formState'
import { useSupabaseStorage } from '../../hooks/useSupabaseStorage'
import { createPhoto } from '../../hooks/usePhotos'
import { makeThumbnail } from '../../utils/compressImage'
import { useToast } from './useFeedback'
import { Button, FilePicker } from './ui'
import { PhotoFields } from './PhotoEditForm'

export function PhotoForm() {
    const { upload, removeByUrl } = useSupabaseStorage()
    const toast = useToast()
    const [formData, setFormData] = useState(EMPTY_PHOTO)
    const [uploading, setUploading] = useState(false)
    const [saving, setSaving] = useState(false)

    // Foto y miniatura subidas pero todavía no guardadas: se borran del bucket si se reemplazan o se abandonan
    const pendingRef = useRef([])

    const discardPending = () => {
        pendingRef.current.forEach(url => removeByUrl(url).catch(() => {}))
        pendingRef.current = []
    }

    useEffect(() => {
        return discardPending
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleFiles = async ([file]) => {
        discardPending()
        setUploading(true)
        try {
            const { url } = await upload(file)
            pendingRef.current.push(url)
            // La grilla de la galería usa la miniatura; el visor, la foto completa
            const { url: thumbUrl } = await upload(await makeThumbnail(file), { compress: false })
            pendingRef.current.push(thumbUrl)
            setFormData(prev => ({ ...prev, imageUrl: url, thumbUrl }))
        } catch (error) {
            toast.error(`No se pudo subir la imagen: ${error.message}`)
        } finally {
            setUploading(false)
        }
    }

    const discardImage = () => {
        discardPending()
        setFormData(prev => ({ ...prev, imageUrl: '', thumbUrl: '' }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            await createPhoto(formData)
            pendingRef.current = []
            toast.success(`Foto "${formData.title}" agregada`)
            setFormData(EMPTY_PHOTO)
        } catch (error) {
            toast.error(`No se pudo guardar la foto: ${error.message}`)
        } finally {
            setSaving(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {formData.imageUrl ? (
                <div className="relative">
                    <img src={formData.imageUrl} alt="" className="w-full max-h-72 object-contain bg-black rounded" />
                    <Button variant="secondary" onClick={discardImage} className="absolute top-2 right-2 bg-black/70">
                        Cambiar imagen
                    </Button>
                </div>
            ) : (
                <FilePicker id="photo-input" label="Elegir imagen" uploading={uploading} onFiles={handleFiles} />
            )}

            <PhotoFields data={formData} onChange={fieldChange(setFormData)} />

            <Button type="submit" disabled={saving || uploading || !formData.imageUrl} className="w-full py-3">
                {saving ? 'Guardando...' : 'Agregar foto'}
            </Button>
        </form>
    )
}
