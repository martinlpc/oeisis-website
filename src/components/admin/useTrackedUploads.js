import { useEffect, useRef, useState } from 'react'
import { useSupabaseStorage } from '../../hooks/useSupabaseStorage'

// Archivos de un formulario que todavía no se guardó:
// - lo subido y no guardado se borra al cancelar o al salir de la pantalla
// - lo guardado que se quita o reemplaza se borra recién al guardar
export function useTrackedUploads() {
    const { upload, removeByUrl } = useSupabaseStorage()
    const [uploading, setUploading] = useState(false)
    const pendingRef = useRef([])
    const removedRef = useRef([])

    useEffect(() => {
        return () => {
            pendingRef.current.forEach(url => removeByUrl(url).catch(() => {}))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const uploadFile = async (file, options) => {
        setUploading(true)
        try {
            const { url } = await upload(file, options)
            pendingRef.current.push(url)
            return url
        } finally {
            setUploading(false)
        }
    }

    const drop = (url) => {
        if (!url) return
        if (pendingRef.current.includes(url)) {
            pendingRef.current = pendingRef.current.filter(u => u !== url)
            removeByUrl(url).catch(() => {})
        } else {
            removedRef.current.push(url)
        }
    }

    // Después de guardar
    const commit = () => {
        removedRef.current.forEach(url => removeByUrl(url).catch(() => {}))
        removedRef.current = []
        pendingRef.current = []
    }

    // Al cancelar
    const rollback = () => {
        pendingRef.current.forEach(url => removeByUrl(url).catch(() => {}))
        pendingRef.current = []
        removedRef.current = []
    }

    return { uploading, uploadFile, drop, commit, rollback }
}
