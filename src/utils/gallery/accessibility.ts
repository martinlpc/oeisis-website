/**
 * Roles y atributos ARIA para la galería
 */

// Roles principales
export const GALLERY_ROLES = {
    GALLERY: 'region',
    CAROUSEL: 'group',
    MODAL: 'dialog',
    FIGURE: 'figure',
    NAVIGATION: 'navigation'
} as const;

// Estados y propiedades ARIA
export const ARIA_STATES = {
    EXPANDED: 'aria-expanded',
    HIDDEN: 'aria-hidden',
    SELECTED: 'aria-selected',
    CURRENT: 'aria-current',
    CONTROLS: 'aria-controls',
    LIVE: 'aria-live',
    MODAL: 'aria-modal',
    LABELLEDBY: 'aria-labelledby',
    DESCRIBEDBY: 'aria-describedby'
} as const;

// Roles específicos de elementos
export const ELEMENT_ROLES = {
    BUTTON: 'button',
    IMG: 'img',
    REGION: 'region',
    DIALOG: 'dialog',
    TABLIST: 'tablist',
    TAB: 'tab',
    TABPANEL: 'tabpanel'
} as const;

// Etiquetas descriptivas
export const ARIA_LABELS = {
    GALLERY: 'Galería de fotos',
    CAROUSEL: 'Carrusel de imágenes',
    MODAL: 'Vista ampliada de la imagen',
    CLOSE: 'Cerrar vista ampliada',
    PREV: 'Imagen anterior',
    NEXT: 'Siguiente imagen',
    CURRENT_SLIDE: (index: number, total: number) => `Imagen ${index + 1} de ${total}`,
    LOADING: 'Cargando imagen',
    ERROR: 'Error al cargar la imagen'
} as const;

// Identificadores para elementos relacionados
export const ARIA_IDS = {
    GALLERY: 'photo-gallery',
    CAROUSEL: 'photo-carousel',
    MODAL: 'photo-modal',
    CAPTION: 'modal-caption',
    DESCRIPTION: 'modal-description'
} as const;

/**
 * Genera las propiedades ARIA para el carrusel
 */
export function getCarouselAriaProps(currentIndex: number, total: number) {
    return {
        role: GALLERY_ROLES.CAROUSEL,
        'aria-roledescription': 'carousel',
        'aria-label': ARIA_LABELS.CAROUSEL,
        'aria-live': 'polite',
        'aria-atomic': 'true',
        'aria-relevant': 'additions text',
        'data-current-slide': currentIndex + 1,
        'data-total-slides': total
    };
}

/**
 * Genera las propiedades ARIA para el modal
 */
export function getModalAriaProps(imageTitle: string) {
    return {
        role: GALLERY_ROLES.MODAL,
        'aria-modal': 'true',
        'aria-labelledby': ARIA_IDS.CAPTION,
        'aria-describedby': ARIA_IDS.DESCRIPTION,
        'aria-label': `${ARIA_LABELS.MODAL}: ${imageTitle}`
    };
}

/**
 * Genera las propiedades ARIA para los botones de navegación
 */
export function getNavigationAriaProps(type: 'prev' | 'next', targetId: string) {
    return {
        role: ELEMENT_ROLES.BUTTON,
        'aria-label': type === 'prev' ? ARIA_LABELS.PREV : ARIA_LABELS.NEXT,
        'aria-controls': targetId
    };
}

/**
 * Genera las propiedades ARIA para los indicadores del carrusel
 */
export function getIndicatorAriaProps(index: number, total: number, isSelected: boolean) {
    return {
        role: ELEMENT_ROLES.TAB,
        'aria-selected': isSelected,
        'aria-label': ARIA_LABELS.CURRENT_SLIDE(index + 1, total),
        'aria-controls': `${ARIA_IDS.CAROUSEL}-slide-${index + 1}`
    };
}