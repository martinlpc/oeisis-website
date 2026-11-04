const STORAGE_URL = /\/storage\/v1\/object\/public\/([^/"'\s?#]+)\/([^"'\s?#]+)/g

// Recorre un documento de Firestore (strings, arrays y objetos anidados)
// y devuelve las referencias "bucket/path" a archivos de Supabase que encuentre.
// Revisa todos los campos, así que también cuenta URLs pegadas dentro de textos.
export function extractStorageRefs(value, refs = new Set()) {
    if (typeof value === 'string') {
        for (const [, bucket, path] of value.matchAll(STORAGE_URL)) {
            refs.add(`${bucket}/${decodeURIComponent(path)}`)
        }
    } else if (Array.isArray(value)) {
        value.forEach(item => extractStorageRefs(item, refs))
    } else if (value && typeof value === 'object') {
        Object.values(value).forEach(item => extractStorageRefs(item, refs))
    }
    return refs
}

// Separa los archivos sin referencia en huérfanos y recientes.
// Los recientes pueden ser de un formulario abierto que todavía no se guardó.
export function findOrphans(files, refs, { graceHours = 24, now = Date.now() } = {}) {
    const orphans = []
    const recent = []
    for (const file of files) {
        if (refs.has(`${file.bucket}/${file.path}`)) continue
        const age = now - new Date(file.createdAt).getTime()
        if (age < graceHours * 3600 * 1000) recent.push(file)
        else orphans.push(file)
    }
    return { orphans, recent }
}
