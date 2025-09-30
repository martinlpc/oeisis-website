import type { ImageMetadata } from 'astro';

export interface GalleryPhoto {
    src: ImageMetadata;
    alt: string;
    title?: string;
    date?: string;
    isError?: boolean;
}

export interface ModalPhoto {
    src: { src: string };
    alt: string;
    title?: string;
    date?: string;
    isError?: boolean;
}

export interface CarouselConfig {
    autoplay: boolean;
    interval: number;
    transitionDuration: number;
    swipeThreshold: number;
}

export interface CarouselState {
    currentIndex: number;
    isTransitioning: boolean;
    touchStartX: number | null;
}

export interface ModalState {
    isOpen: boolean;
    currentIndex: number;
    image: ModalPhoto | null;
}

export interface CarouselElements {
    track: HTMLElement;
    slides: HTMLElement[];
    prevButton: HTMLElement | null;
    nextButton: HTMLElement | null;
    dots: HTMLElement[];
}

export interface ModalElements {
    container: HTMLElement;
    image: HTMLImageElement;
    caption: HTMLElement;
    title: HTMLElement | null;
    date: HTMLElement | null;
    closeButton: HTMLElement | null;
    prevButton: HTMLElement | null;
    nextButton: HTMLElement | null;
}

// Tipos para los eventos personalizados
export type CarouselEventType = 'next' | 'prev' | 'goto' | 'play' | 'pause';

export interface CarouselEvent {
    type: CarouselEventType;
    index?: number;
}

// Tipos para los callbacks
export type CarouselCallback = (state: CarouselState) => void;
export type ModalCallback = (state: ModalState) => void;