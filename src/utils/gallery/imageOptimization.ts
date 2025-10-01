import type { GalleryPhoto, ModalPhoto } from '../../types/gallery.js';
import { IMAGE_CONFIG } from './config.js';

type ImageLikePhoto = GalleryPhoto | ModalPhoto;

/**
 * Crea un placeholder blur mientras la imagen se carga
 */
export async function createPlaceholder(width: number, height: number): Promise<string> {
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Crear un gradiente gris suave
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#2a2a2a');
    gradient.addColorStop(1, '#1a1a1a');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    return canvas.convertToBlob()
        .then(blob => URL.createObjectURL(blob))
        .catch(() => '');
}

/**
 * Configura el IntersectionObserver para lazy loading
 */
export function setupLazyLoading(): void {
    const images = document.querySelectorAll('.gallery-image');
    
    const imageObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target as HTMLImageElement;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('loading');
                        observer.unobserve(img);
                    }
                }
            });
        },
        {
            rootMargin: '50px 0px',
            threshold: 0.01
        }
    );
    
    images.forEach(img => imageObserver.observe(img));
}

/**
 * Precargar las imágenes adyacentes a la actual
 */
export async function preloadAdjacentImages(
    currentIndex: number,
    photos: GalleryPhoto[],
    count: number = 2
): Promise<void> {
    const totalImages = photos.length;
    const indicesToLoad: number[] = [];
    
    // Añadir índices anteriores y siguientes
    for (let i = 1; i <= count; i++) {
        indicesToLoad.push((currentIndex + i) % totalImages);
        indicesToLoad.push((currentIndex - i + totalImages) % totalImages);
    }
    
    const uniqueIndices = [...new Set(indicesToLoad)];
    
    // Crear array de promesas para cargar las imágenes
    const preloadPromises = uniqueIndices.map(index => {
        const img = new Image();
        return new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.src = photos[index].src.src;
        });
    });
    
    // Cargar todas las imágenes en paralelo
    await Promise.all(preloadPromises);
}

/**
 * Genera los srcset y sizes para imágenes responsivas
 */
export function generateImageAttributes(photo: GalleryPhoto) {
    const { widths, sizes } = IMAGE_CONFIG;
    
    // Generar srcset para diferentes tamaños
    const srcset = widths
        .map(w => `${photo.src.src} ${w}w`)
        .join(', ');
    
    return {
        srcset,
        sizes,
        loading: IMAGE_CONFIG.loading,
        'data-src': photo.src.src
    };
}