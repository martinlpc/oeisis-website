import type { ImageMetadata } from 'astro';
import type { GalleryPhoto } from '../../types/gallery.ts';

export function processGalleryImages(imageFiles: Record<string, { default: ImageMetadata }>) {
    const photos: GalleryPhoto[] = [];
    
    try {
        // Convertir el objeto de imágenes en un array y ordenar por nombre de archivo
        Object.entries(imageFiles)
            .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
            .forEach(([path, image]) => {
                // Extraer el nombre del archivo de la ruta completa
                const filename = path.split('/').pop()?.split('.')[0] || '';
                
                // Crear el título a partir del nombre del archivo
                const title = formatImageTitle(filename);

                // Crear el objeto de la foto
                photos.push({
                    src: image.default,
                    alt: `Oeisis - ${title}`,
                    title: title,
                    date: extractYearFromFilename(filename)
                });
            });
    } catch (error) {
        console.error('Error procesando imágenes de la galería:', error);
    }

    return photos;
}

export function formatImageTitle(filename: string): string {
    return filename
        .split(/[-_]/)
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

export function extractYearFromFilename(filename: string): string {
    return filename.match(/\d{4}/)?.[0] || '';
}

export function preloadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = src;
    });
}

export function preloadAdjacentImages(photos: GalleryPhoto[], currentIndex: number): void {
    const totalPhotos = photos.length;
    const nextIndex = (currentIndex + 1) % totalPhotos;
    const prevIndex = (currentIndex - 1 + totalPhotos) % totalPhotos;

    // Precargar imagen siguiente y anterior
    [nextIndex, prevIndex].forEach(index => {
        const photo = photos[index];
        if (photo?.src) {
            preloadImage(photo.src.src);
        }
    });
}