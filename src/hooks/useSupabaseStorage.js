import { supabase } from "../utils/supabase";

const BUCKET_MAP = {
    'image': 'images',
    'video': 'videos',
    'audio': 'audio'
}

export function useSupabaseStorage() {
    const upload = async (file) => {
        const type = file.type.split('/')[0]
        const bucket = BUCKET_MAP[type]
        const path = `${Date.now()}-${file.name}`

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
        const { error } = await supabase.storage.from(bucket).remove([path])
        if (error) throw error
    }

    // Elimina el archivo a partir de la URL pública de Supabase.
    // Si la URL no es de Supabase (legacy, otro host), no hace nada.
    const removeByUrl = async (url) => {
        const match = String(url || '').match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/)
        if (!match) return
        const [, bucket, path] = match
        await remove(bucket, path)
    }

    return { upload, list, remove, removeByUrl }
}