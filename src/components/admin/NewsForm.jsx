import { useState, useRef, useEffect } from 'react'
import { EMPTY_NEWS, fieldChange, isValidYouTube } from './formState'
import { createNews } from '../../hooks/useNews'
import { useSupabaseStorage } from '../../hooks/useSupabaseStorage'
import { useToast } from './useFeedback'
import { Button } from './ui'
import { NewsFields } from './NewsEditForm'
import { warnIfNotTranslated } from './englishFeedback'

export function NewsForm() {
    const { upload, removeByUrl } = useSupabaseStorage()
    const toast = useToast()
    const [formData, setFormData] = useState(EMPTY_NEWS)
    const [images, setImages] = useState([])
    const [uploading, setUploading] = useState(false)
    const [saving, setSaving] = useState(false)

    // Imágenes subidas pero no guardadas: se borran del bucket si el formulario se abandona
    const pendingRef = useRef([])

    useEffect(() => {
        return () => {
            pendingRef.current.forEach(url => removeByUrl(url).catch(() => {}))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleImageFiles = async (files) => {
        setUploading(true)
        try {
            for (const file of files) {
                const { url } = await upload(file)
                pendingRef.current.push(url)
                setImages(prev => [...prev, url])
            }
        } catch (error) {
            toast.error(`No se pudo subir una imagen: ${error.message}`)
        } finally {
            setUploading(false)
        }
    }

    const removeImage = (index) => {
        const url = images[index]
        pendingRef.current = pendingRef.current.filter(u => u !== url)
        removeByUrl(url).catch(() => {})
        setImages(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const isInterview = formData.type === 'interview'
        if (isInterview && formData.externalLink && !isValidYouTube(formData.externalLink)) {
            toast.error('Revisá el link de YouTube')
            return
        }
        setSaving(true)
        try {
            const result = await createNews({
                title: formData.title,
                content: formData.content,
                type: formData.type,
                externalLink: isInterview ? formData.externalLink : '',
                images: isInterview ? [] : images,
                date: new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' }),
                featured: formData.featured,
            })
            // Si era entrevista, las imágenes que se hayan subido antes de cambiar el tipo no se usan
            if (isInterview) images.forEach(url => removeByUrl(url).catch(() => {}))
            pendingRef.current = []
            toast.success(`Noticia "${formData.title}" publicada`)
            warnIfNotTranslated(toast, result)
            setFormData(EMPTY_NEWS)
            setImages([])
        } catch (error) {
            toast.error(`No se pudo publicar: ${error.message}`)
        } finally {
            setSaving(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <NewsFields
                idPrefix="new-news"
                data={formData}
                onChange={fieldChange(setFormData)}
                images={images}
                uploading={uploading}
                onImageFiles={handleImageFiles}
                onRemoveImage={removeImage}
            />
            <Button type="submit" disabled={saving || uploading} className="w-full py-3">
                {saving ? 'Publicando...' : 'Publicar noticia'}
            </Button>
        </form>
    )
}
