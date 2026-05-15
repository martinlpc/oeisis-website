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

    return { upload, list, remove }
}