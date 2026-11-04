import { supabase } from "../utils/supabase";
import { compressImage } from "../utils/compressImage";

const BUCKET_MAP = {
    'image': 'images',
    'video': 'videos',
    'audio': 'audio',
    'application': 'documents', // PDFs (rider, gacetilla)
}

// Supabase rechaza keys con tildes y algunos símbolos; los espacios terminan como %20 en la URL
const sanitizeFileName = (name) => name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .toLowerCase()

export function useSupabaseStorage() {
    // compress: false sube el archivo tal cual (fotos de prensa en alta)
    const upload = async (originalFile, { compress = true } = {}) => {
        const file = compress ? await compressImage(originalFile) : originalFile
        const type = file.type.split('/')[0]
        const bucket = BUCKET_MAP[type]
        if (!bucket) throw new Error(`Tipo de archivo no soportado: ${file.type || file.name}`)
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

    // Lista todos los archivos de la raíz del bucket (la API pagina de a 100 como máximo)
    const listAll = async (bucket) => {
        const files = []
        const pageSize = 100
        for (let offset = 0; ; offset += pageSize) {
            const { data, error } = await supabase.storage.from(bucket).list('', {
                limit: pageSize,
                offset,
                sortBy: { column: 'name', order: 'asc' },
            })
            if (error) throw error
            for (const item of data) {
                // Las carpetas vienen sin id; el placeholder lo crea el dashboard
                if (!item.id || item.name === '.emptyFolderPlaceholder') continue
                files.push({
                    bucket,
                    path: item.name,
                    size: item.metadata?.size ?? 0,
                    createdAt: item.created_at,
                    url: supabase.storage.from(bucket).getPublicUrl(item.name).data.publicUrl,
                })
            }
            if (data.length < pageSize) break
        }
        return files
    }

    // Borra varios archivos del mismo bucket y devuelve cuántos se borraron de verdad
    const removeMany = async (bucket, paths) => {
        let deleted = 0
        for (let i = 0; i < paths.length; i += 100) {
            const { data, error } = await supabase.storage.from(bucket).remove(paths.slice(i, i + 100))
            if (error) throw error
            deleted += data?.length ?? 0
        }
        return deleted
    }

    // Elimina el archivo a partir de la URL pública de Supabase.
    // Si la URL no es de Supabase (legacy, otro host), no hace nada.
    const removeByUrl = async (url) => {
        const match = String(url || '').match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/)
        if (!match) return
        const [, bucket, encodedPath] = match
        await remove(bucket, decodeURIComponent(encodedPath))
    }

    return { upload, list, listAll, remove, removeMany, removeByUrl }
}