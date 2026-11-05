// Redimensiona y recomprime una imagen en el navegador antes de subirla.
// Una foto de celular (4000px, 5-10 MB) queda en ~1920px y unos cientos de KB.
const SKIP_TYPES = ['image/gif', 'image/svg+xml']

function canvasToBlob(canvas, type, quality) {
    return new Promise(resolve => canvas.toBlob(resolve, type, quality))
}

// type: 'image/jpeg' fuerza JPEG (para imágenes de vista previa en redes, que no siempre aceptan WebP)
export async function compressImage(file, { maxSize = 1920, quality = 0.82, type = 'image/webp' } = {}) {
    if (!file.type.startsWith('image/') || SKIP_TYPES.includes(file.type)) return file

    let bitmap
    try {
        // from-image aplica la orientación EXIF (fotos de celular giradas)
        bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
    } catch {
        return file // formato que el navegador no puede decodificar (ej. HEIC en Chrome)
    }

    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height))
    const width = Math.round(bitmap.width * scale)
    const height = Math.round(bitmap.height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    canvas.getContext('2d').drawImage(bitmap, 0, 0, width, height)
    bitmap.close()

    // Algunos Safari no codifican WebP y devuelven PNG: en ese caso se usa JPEG
    let blob = type === 'image/webp' ? await canvasToBlob(canvas, 'image/webp', quality) : null
    if (!blob || blob.type !== 'image/webp') {
        blob = await canvasToBlob(canvas, 'image/jpeg', quality)
    }

    // Si no ganamos nada (imagen ya chica y optimizada), se sube la original
    if (!blob || blob.size >= file.size) return file

    const extension = blob.type === 'image/webp' ? 'webp' : 'jpg'
    const name = file.name.replace(/\.[^.]+$/, '') + '.' + extension
    return new File([blob], name, { type: blob.type, lastModified: Date.now() })
}

// Miniatura para grillas: 640 px alcanza para una celda de la galería en pantallas de alta densidad.
// Una foto de 1920 px pesa unos cientos de KB; la miniatura, unas decenas.
export async function makeThumbnail(file) {
    const named = new File([file], file.name.replace(/(\.[^.]+)?$/, '-thumb$1'), { type: file.type })
    return compressImage(named, { maxSize: 640, quality: 0.75 })
}
