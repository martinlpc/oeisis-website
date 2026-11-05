import { useState } from 'react'
import { usePhotos, updatePhoto } from '../../hooks/usePhotos'
import { useSupabaseStorage } from '../../hooks/useSupabaseStorage'
import { makeThumbnail } from '../../utils/compressImage'
import { useToast } from './useFeedback'
import { Button, StatusText } from './ui'

// Crea la miniatura de las fotos cargadas antes de que existieran (las nuevas ya la traen)
export function PhotoThumbnails() {
    const { photos, loading, error } = usePhotos()
    const { upload } = useSupabaseStorage()
    const toast = useToast()
    const [progress, setProgress] = useState(null)

    if (loading) return <StatusText>Buscando fotos sin miniatura...</StatusText>
    if (error) return <StatusText error>Error: {error}</StatusText>

    const pending = photos.filter(photo => photo.imageUrl && !photo.thumbUrl)
    if (pending.length === 0) return <StatusText>Todas las fotos de la galería tienen miniatura.</StatusText>

    const createAll = async () => {
        let done = 0
        let failed = 0
        setProgress(0)
        for (const photo of pending) {
            try {
                const response = await fetch(photo.imageUrl)
                if (!response.ok) throw new Error(`HTTP ${response.status}`)
                const blob = await response.blob()
                const name = decodeURIComponent(photo.imageUrl.split('/').pop().split('?')[0]).replace(/^\d+-/, '')
                const thumb = await makeThumbnail(new File([blob], name, { type: blob.type }))
                const { url } = await upload(thumb, { compress: false })
                await updatePhoto(photo.id, { thumbUrl: url })
                done++
            } catch (err) {
                console.error('No se pudo crear la miniatura', photo.id, err)
                failed++
            }
            setProgress(done + failed)
        }
        setProgress(null)
        if (failed === 0) toast.success(`Se crearon ${done} miniaturas`)
        else toast.warning(`Se crearon ${done}. Fallaron ${failed}: revisá la consola del navegador.`)
    }

    return (
        <div className="space-y-4">
            <p className="text-gray-300">
                {pending.length} {pending.length === 1 ? 'foto se carga' : 'fotos se cargan'} en tamaño completo en la grilla de la galería.
                Con miniatura, la galería carga mucho más rápido en el celular. El visor sigue mostrando la foto completa.
            </p>
            <Button onClick={createAll} disabled={progress !== null}>
                {progress !== null ? `Creando ${progress} de ${pending.length}...` : 'Crear miniaturas'}
            </Button>
        </div>
    )
}
