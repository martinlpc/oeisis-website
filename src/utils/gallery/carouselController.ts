import type { CarouselState, CarouselConfig, CarouselCallback, CarouselEvent } from '../../types/gallery.js';

export class CarouselController {
    private state: CarouselState;
    private config: CarouselConfig;
    private callbacks: Set<CarouselCallback>;
    private autoplayTimer: number | null;
    private isPlaying: boolean;
    
    constructor(config: CarouselConfig) {
        this.state = {
            currentIndex: 0,
            isTransitioning: false,
            touchStartX: null
        };
        this.isPlaying = config.autoplay;
        this.config = config;
        this.callbacks = new Set();
        this.autoplayTimer = null;
        
        if (config.autoplay) {
            this.startAutoplay();
        }
    }
    
    public subscribe(callback: CarouselCallback): () => void {
        this.callbacks.add(callback);
        return () => this.callbacks.delete(callback);
    }
    
    private notify(): void {
        this.callbacks.forEach(callback => callback(this.state));
    }
    
    public next(): void {
        this.handleEvent({ type: 'next' });
    }
    
    public prev(): void {
        this.handleEvent({ type: 'prev' });
    }
    
    public goTo(index: number): void {
        this.handleEvent({ type: 'goto', index });
    }
    
    public play(): void {
        this.handleEvent({ type: 'play' });
    }
    
    public pause(): void {
        this.handleEvent({ type: 'pause' });
    }
    
    private handleEvent(event: CarouselEvent): void {
        switch (event.type) {
            case 'next':
                this.state.currentIndex = (this.state.currentIndex + 1) % this.totalSlides;
                break;
            case 'prev':
                this.state.currentIndex = (this.state.currentIndex - 1 + this.totalSlides) % this.totalSlides;
                break;
            case 'goto':
                if (typeof event.index === 'number') {
                    this.state.currentIndex = event.index;
                }
                break;
            case 'play':
                this.isPlaying = true;
                this.startAutoplay();
                break;
            case 'pause':
                this.isPlaying = false;
                this.stopAutoplay();
                break;
        }
        
        this.notify();
    }
    
    private startAutoplay(): void {
        if (this.autoplayTimer !== null) {
            this.stopAutoplay();
        }
        this.autoplayTimer = window.setInterval(() => {
            this.next();
        }, this.config.interval);
    }
    
    private stopAutoplay(): void {
        if (this.autoplayTimer !== null) {
            window.clearInterval(this.autoplayTimer);
            this.autoplayTimer = null;
        }
    }
    
    public destroy(): void {
        this.stopAutoplay();
        this.callbacks.clear();
    }
    
    private get totalSlides(): number {
        // Este valor debería ser actualizado cuando se inicializa el carrusel
        return document.querySelectorAll('.carousel-track > *').length;
    }
}