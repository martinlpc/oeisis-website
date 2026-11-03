import { supabase } from "../utils/supabase";

const BUCKET_MAP = {
    'image': 'images',
    'video': 'videos',
    'audio': 'audio'
}

// Supabase rechaza keys con tildes y algunos símbolos; los espacios terminan como %20 en la URL
const sanitizeFileName = (name) => name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .toLowerCase()

export function useSupabaseStorage() {
    const upload = async (file) => {
        const type = file.type.split('/')[0]
        const bucket = BUCKET_MAP[type]
        const path = `${Date.now()}-${sanitizeFileName(file.name)}`

        const { error } = await supabase.storage.from(bucket).upload(path, file)
        if (error) throw error

        const { data } = supabase.storage.from(bucket).getPublicUrl(path)
        return { url: data.publicUrl, bucket, path }
    }

    const list = async (bucket) => {
        const { data, error } = await supabase.storage.from(bucket).list()
        if (error) throw error
        return data.map(file => ({
            name: file.name,
            url: supabase.storage.from(bucket).getPublicUrl(file.name).data.publicUrl
        }))
    }

    const remove = async (bucket, path) => {
        const { data, error } = await supabase.storage.from(bucket).remove([path])
        if (error) throw error
        // Si RLS bloquea el borrado, Supabase no devuelve error: solo una lista vacía
        if (!data || data.length === 0) {
            throw new Error(`No se pudo borrar ${bucket}/${path} (sin permiso o inexistente)`)
        }
    }

    // Elimina el archivo a partir de la URL pública de Supabase.
    // Si la URL no es de Supabase (legacy, otro host), no hace nada.
    const removeByUrl = async (url) => {
        const match = String(url || '').match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/)
        if (!match) return
        const [, bucket, encodedPath] = match
        await remove(bucket, decodeURIComponent(encodedPath))
    }

    return { upload, list, remove, removeByUrl }
}