/**
 * Utilidades para el manejo del foco en elementos interactivos
 */

type FocusableElement = HTMLElement & {
    tabIndex: number;
};

/**
 * Obtiene todos los elementos focusables dentro de un contenedor
 */
export function getFocusableElements(container: HTMLElement): FocusableElement[] {
    const selector = [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])'
    ].join(', ');
    
    return Array.from(container.querySelectorAll(selector)) as FocusableElement[];
}

/**
 * Clase para manejar el trap focus en un modal o diálogo
 */
export class FocusTrap {
    private container: HTMLElement;
    private focusableElements: FocusableElement[];
    private firstFocusable: FocusableElement | null;
    private lastFocusable: FocusableElement | null;
    private previousActiveElement: HTMLElement | null;
    
    constructor(container: HTMLElement) {
        this.container = container;
        this.focusableElements = getFocusableElements(container);
        this.firstFocusable = this.focusableElements[0] || null;
        this.lastFocusable = this.focusableElements[this.focusableElements.length - 1] || null;
        this.previousActiveElement = document.activeElement as HTMLElement;
        
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }
    
    /**
     * Activa el trap focus
     */
    activate(): void {
        // Guardar el elemento activo actual
        this.previousActiveElement = document.activeElement as HTMLElement;
        
        // Establecer el foco en el primer elemento focusable
        if (this.firstFocusable) {
            this.firstFocusable.focus();
        }
        
        // Agregar event listener para el manejo del teclado
        document.addEventListener('keydown', this.handleKeyDown);
    }
    
    /**
     * Desactiva el trap focus
     */
    deactivate(): void {
        document.removeEventListener('keydown', this.handleKeyDown);
        
        // Restaurar el foco al elemento anterior
        if (this.previousActiveElement && 'focus' in this.previousActiveElement) {
            this.previousActiveElement.focus();
        }
    }
    
    /**
     * Maneja el evento keydown para el trap focus
     */
    private handleKeyDown(event: KeyboardEvent): void {
        if (event.key !== 'Tab') return;
        
        // Si no hay elementos focusables, no hacemos nada
        if (!this.firstFocusable || !this.lastFocusable) return;
        
        const activeElement = document.activeElement;
        
        // Shift + Tab en el primer elemento
        if (event.shiftKey && activeElement === this.firstFocusable) {
            event.preventDefault();
            this.lastFocusable.focus();
        }
        
        // Tab en el último elemento
        if (!event.shiftKey && activeElement === this.lastFocusable) {
            event.preventDefault();
            this.firstFocusable.focus();
        }
    }
    
    /**
     * Actualiza la lista de elementos focusables
     */
    updateFocusableElements(): void {
        this.focusableElements = getFocusableElements(this.container);
        this.firstFocusable = this.focusableElements[0] || null;
        this.lastFocusable = this.focusableElements[this.focusableElements.length - 1] || null;
    }
}