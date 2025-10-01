// Configuración del carrusel
export const CAROUSEL_CONFIG = {
    autoplay: true,
    interval: 3000,
    transitionDuration: 500,
    swipeThreshold: 40
} as const;

// Configuración de las imágenes
export const IMAGE_CONFIG = {
    widths: [320, 640, 960, 1200, 1600],
    sizes: '(max-width: 640px) 100vw, 90vw',
    formats: ['webp', 'avif', 'jpg'],
    loading: 'lazy' as const,
    placeholder: 'blur',
    quality: 80
} as const;

// Configuración de accesibilidad
export const ARIA_LABELS = {
    gallery: 'Galería de fotos',
    carousel: 'Carrusel de imágenes',
    modal: 'Vista ampliada de la imagen',
    closeModal: 'Cerrar vista ampliada',
    prevImage: 'Imagen anterior',
    nextImage: 'Siguiente imagen',
    slideImage: (index: number, total: number) => `Imagen ${index + 1} de ${total}`
} as const;