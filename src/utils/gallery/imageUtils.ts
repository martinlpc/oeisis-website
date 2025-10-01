import type { ImageMetadata } from 'astro';
import type { GalleryPhoto } from '../../types/gallery.ts';

// Crear un ImageMetadata de error para fallback
export function createErrorImageMetadata(): ImageMetadata {
    return {
        src: '/images/error-placeholder.svg', // Imagen de error por defecto
        width: 400,
        height: 300,
        format: 'svg'
    };
}

// Configuración para manejo de errores
export const ERROR_CONFIG = {
    maxRetries: 3,
    retryDelay: 1000, // ms
    fallbackImage: '/images/error-placeholder.svg'
} as const;

// Función para reintentar carga de imagen con exponential backoff
export async function retryImageLoad(src: string, maxRetries: number = ERROR_CONFIG.maxRetries): Promise<string> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            await preloadImage(src);
            return src; // Éxito
        } catch (error) {
            lastError = error as Error;
            console.warn(`Intento ${attempt + 1}/${maxRetries + 1} fallido para imagen: ${src}`, error);
            
            if (attempt < maxRetries) {
                // Exponential backoff: 1s, 2s, 4s
                const delay = ERROR_CONFIG.retryDelay * Math.pow(2, attempt);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    
    // Si todos los intentos fallan, lanzar el último error
    throw lastError || new Error('Failed to load image after maximum retries');
}

// Función para verificar si una imagen existe y es válida
export async function validateImage(imageMetadata: ImageMetadata): Promise<{ isValid: boolean; error?: string }> {
    try {
        if (!imageMetadata?.src) {
            return { isValid: false, error: 'ImageMetadata inválido: src faltante' };
        }
        
        await preloadImage(imageMetadata.src);
        return { isValid: true };
    } catch (error) {
        return { 
            isValid: false, 
            error: error instanceof Error ? error.message : 'Error desconocido cargando imagen' 
        };
    }
}

export function processGalleryImages(imageFiles: Record<string, { default: ImageMetadata }>) {
    const photos: GalleryPhoto[] = [];
    
    try {
        // Convertir el objeto de imágenes en un array y ordenar por nombre de archivo
        Object.entries(imageFiles)
            .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
            .forEach(([path, image]) => {
                try {
                    // Validar que la imagen tenga los datos requeridos
                    if (!image?.default?.src) {
                        console.warn(`Imagen inválida encontrada en: ${path}`);
                        return;
                    }

                    // Extraer el nombre del archivo de la ruta completa
                    const filename = path.split('/').pop()?.split('.')[0] || '';
                    
                    // Crear el título a partir del nombre del archivo
                    const title = formatImageTitle(filename);

                    // Crear el objeto de la foto con validación de error
                    photos.push({
                        src: image.default,
                        alt: `Oeisis - ${title}`,
                        title: title,
                        date: extractYearFromFilename(filename),
                        isError: false, // Inicialmente sin error
                        originalPath: path // Guardar ruta original para debugging
                    });
                } catch (imageError) {
                    console.error(`Error procesando imagen individual ${path}:`, imageError);
                    // Agregar entrada de error para mostrar en la UI
                    const filename = path.split('/').pop()?.split('.')[0] || 'unknown';
                    photos.push({
                        src: createErrorImageMetadata(),
                        alt: `Error cargando imagen: ${formatImageTitle(filename)}`,
                        title: formatImageTitle(filename),
                        date: extractYearFromFilename(filename),
                        isError: true,
                        originalPath: path
                    });
                }
            });
    } catch (error) {
        console.error('Error procesando imágenes de la galería:', error);
        // Si falla completamente, devolver al menos una imagen de error
        photos.push({
            src: createErrorImageMetadata(),
            alt: 'Error cargando galería',
            title: 'Error en la galería',
            date: '',
            isError: true,
            originalPath: ''
        });
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

export function preloadAdjacentImages(currentIndex: number, photos: GalleryPhoto[]): void {
    const totalPhotos = photos.length;
    const nextIndex = (currentIndex + 1) % totalPhotos;
    const prevIndex = (currentIndex - 1 + totalPhotos) % totalPhotos;

    // Precargar imagen siguiente y anterior con manejo de errores
    [nextIndex, prevIndex].forEach(async (index) => {
        const photo = photos[index];
        if (photo?.src?.src && !photo.isError) {
            try {
                await retryImageLoad(photo.src.src, 1); // Solo 1 reintento para preload
            } catch (error) {
                console.warn(`Error precargando imagen en índice ${index}:`, error);
                // No actualizamos el estado aquí, solo logueamos el error
            }
        }
    });
}

// Función para reintentar carga de una imagen específica en runtime
export async function retryFailedImage(photo: GalleryPhoto, imageElement: HTMLImageElement): Promise<boolean> {
    if (!photo.originalPath || photo.retryCount && photo.retryCount >= ERROR_CONFIG.maxRetries) {
        return false; // Ya se agotaron los reintentos
    }

    try {
        const retryCount = (photo.retryCount || 0) + 1;
        console.log(`Reintentando carga de imagen (intento ${retryCount}/${ERROR_CONFIG.maxRetries}): ${photo.originalPath}`);
        
        // Intentar cargar la imagen original
        await retryImageLoad(photo.src.src, 1);
        
        // Si llega aquí, la carga fue exitosa
        photo.isError = false;
        photo.retryCount = retryCount;
        photo.lastError = undefined;
        
        // Actualizar la imagen en el DOM
        imageElement.src = photo.src.src;
        imageElement.alt = photo.alt;
        
        return true;
    } catch (error) {
        // Actualizar contador de reintentos y último error
        photo.retryCount = (photo.retryCount || 0) + 1;
        photo.lastError = error instanceof Error ? error.message : 'Error desconocido';
        
        console.error(`Reintento ${photo.retryCount} fallido para imagen ${photo.originalPath}:`, error);
        
        // Si se agotaron los reintentos, mantener la imagen de error
        if (photo.retryCount >= ERROR_CONFIG.maxRetries) {
            console.error(`Se agotaron los reintentos para la imagen: ${photo.originalPath}`);
        }
        
        return false;
    }
}

// Función para obtener el texto de estado de error
export function getErrorStatusText(photo: GalleryPhoto): string {
    if (!photo.isError) return '';
    
    const retryCount = photo.retryCount || 0;
    const maxRetries = ERROR_CONFIG.maxRetries;
    
    if (retryCount >= maxRetries) {
        return `Error: Se agotaron los reintentos (${retryCount}/${maxRetries})`;
    } else if (retryCount > 0) {
        return `Error: Reintento ${retryCount}/${maxRetries}`;
    } else {
        return 'Error cargando imagen - Haz clic para reintentar';
    }
}