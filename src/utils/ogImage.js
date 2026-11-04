// Imagen de 1200×630 para compartir en redes (proporción 1,91:1 que usan Facebook, X, LinkedIn).
// El flyer entra completo al centro, sobre un fondo hecho con el mismo flyer desenfocado y oscurecido,
// así un flyer vertical u horizontal nunca se recorta en la vista previa.
export const OG_WIDTH = 1200
export const OG_HEIGHT = 630

export async function makeOgImage(file, { quality = 0.85 } = {}) {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
    const canvas = document.createElement('canvas')
    canvas.width = OG_WIDTH
    canvas.height = OG_HEIGHT
    const ctx = canvas.getContext('2d')

    // Fondo: el flyer cubriendo todo, desenfocado y oscuro
    const cover = Math.max(OG_WIDTH / bitmap.width, OG_HEIGHT / bitmap.height) * 1.1
    ctx.filter = 'blur(28px) brightness(0.45)'
    ctx.drawImage(
        bitmap,
        (OG_WIDTH - bitmap.width * cover) / 2, (OG_HEIGHT - bitmap.height * cover) / 2,
        bitmap.width * cover, bitmap.height * cover,
    )
    ctx.filter = 'none'

    // Frente: el flyer completo, con un margen
    const margin = 30
    const contain = Math.min((OG_WIDTH - margin * 2) / bitmap.width, (OG_HEIGHT - margin * 2) / bitmap.height)
    const w = bitmap.width * contain
    const h = bitmap.height * contain
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)'
    ctx.shadowBlur = 30
    ctx.drawImage(bitmap, (OG_WIDTH - w) / 2, (OG_HEIGHT - h) / 2, w, h)
    bitmap.close()

    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality))
    const name = file.name.replace(/\.[^.]+$/, '') + '-og.jpg'
    return new File([blob], name, { type: 'image/jpeg', lastModified: Date.now() })
}
