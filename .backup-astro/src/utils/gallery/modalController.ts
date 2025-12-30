import type { ModalState, ModalPhoto, ModalCallback } from '../../types/gallery.js';

export class ModalController {
    private state: ModalState;
    private callbacks: Set<ModalCallback>;
    private trapFocusElements: HTMLElement[];
    
    constructor() {
        this.state = {
            isOpen: false,
            currentIndex: 0,
            image: null
        };
        this.callbacks = new Set();
        this.trapFocusElements = [];
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }
    
    public subscribe(callback: ModalCallback): () => void {
        this.callbacks.add(callback);
        return () => this.callbacks.delete(callback);
    }
    
    public getState(): ModalState {
        return this.state;
    }
    
    private notify(): void {
        this.callbacks.forEach(callback => callback(this.state));
    }
    
    public open(index: number, image: ModalPhoto): void {
        this.state = {
            isOpen: true,
            currentIndex: index,
            image
        };
        
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', this.handleKeyDown);
        this.setupFocusTrap();
        this.notify();
    }
    
    public close(): void {
        this.state = {
            ...this.state,
            isOpen: false
        };
        
        document.body.style.overflow = '';
        document.removeEventListener('keydown', this.handleKeyDown);
        this.removeFocusTrap();
        this.notify();
    }
    
    public next(images: ModalPhoto[]): void {
        const nextIndex = (this.state.currentIndex + 1) % images.length;
        this.open(nextIndex, images[nextIndex]);
    }
    
    public prev(images: ModalPhoto[]): void {
        const prevIndex = (this.state.currentIndex - 1 + images.length) % images.length;
        this.open(prevIndex, images[prevIndex]);
    }
    
    private handleKeyDown(event: KeyboardEvent): void {
        if (!this.state.isOpen) return;
        
        switch (event.key) {
            case 'Escape':
                this.close();
                break;
            case 'Tab':
                this.handleTabKey(event);
                break;
        }
    }
    
    private setupFocusTrap(): void {
        const modal = document.getElementById('imageModal');
        if (!modal) return;
        
        this.trapFocusElements = Array.from(
            modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )
        ) as HTMLElement[];
        
        if (this.trapFocusElements.length > 0) {
            this.trapFocusElements[0].focus();
        }
    }
    
    private handleTabKey(event: KeyboardEvent): void {
        if (this.trapFocusElements.length === 0) return;
        
        const firstElement = this.trapFocusElements[0];
        const lastElement = this.trapFocusElements[this.trapFocusElements.length - 1];
        const activeElement = document.activeElement;
        
        if (event.shiftKey) {
            if (activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            }
        } else {
            if (activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    }
    
    private removeFocusTrap(): void {
        this.trapFocusElements = [];
    }
    
    public destroy(): void {
        document.removeEventListener('keydown', this.handleKeyDown);
        this.callbacks.clear();
    }
}