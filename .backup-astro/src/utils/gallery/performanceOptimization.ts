import type { CarouselState } from '../../types/gallery.js';
import { preloadAdjacentImages } from './imageOptimization.js';

/**
 * Clase para manejar la optimización del rendimiento del carrusel
 */
export class PerformanceOptimizer {
    private observer: IntersectionObserver | null = null;
    private isVisible = false;
    private rafId: number | null = null;
    
    constructor(
        private container: HTMLElement,
        private onVisibilityChange: (isVisible: boolean) => void
    ) {
        this.setupIntersectionObserver();
    }
    
    /**
     * Configura el IntersectionObserver para detectar visibilidad
     */
    private setupIntersectionObserver(): void {
        this.observer = new IntersectionObserver(
            (entries) => {
                const isVisible = entries[0].isIntersecting;
                if (this.isVisible !== isVisible) {
                    this.isVisible = isVisible;
                    this.onVisibilityChange(isVisible);
                }
            },
            {
                threshold: 0.1
            }
        );
        
        this.observer.observe(this.container);
    }
    
    /**
     * Optimiza las animaciones usando requestAnimationFrame
     */
    public requestUpdate(callback: () => void): void {
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
        }
        
        this.rafId = requestAnimationFrame(() => {
            callback();
            this.rafId = null;
        });
    }
    
    /**
     * Limpia los recursos del optimizador
     */
    public destroy(): void {
        if (this.observer) {
            this.observer.disconnect();
        }
        
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
        }
    }
}

/**
 * Clase para manejar el renderizado eficiente
 */
export class RenderOptimizer {
    private readonly updateThreshold = 16; // ~60fps
    private lastUpdateTime = 0;
    
    /**
     * Determina si es necesario actualizar el renderizado
     */
    shouldUpdate(): boolean {
        const now = performance.now();
        if (now - this.lastUpdateTime >= this.updateThreshold) {
            this.lastUpdateTime = now;
            return true;
        }
        return false;
    }
    
    /**
     * Resetea el temporizador de actualización
     */
    reset(): void {
        this.lastUpdateTime = 0;
    }
}

/**
 * Debounce function para optimizar eventos frecuentes
 */
export function debounce<T extends (...args: any[]) => void>(
    fn: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;
    
    return function (...args: Parameters<T>) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

/**
 * Throttle function para limitar la frecuencia de ejecución
 */
export function throttle<T extends (...args: any[]) => void>(
    fn: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    
    return function (...args: Parameters<T>) {
        if (!inThrottle) {
            fn(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}