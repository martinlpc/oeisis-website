import { useEffect, useRef } from 'react';

// Visor de fotos: Esc o click afuera cierra, flechas (teclado, botones o swipe) navegan
export function Lightbox({ photos, index, onClose, onChange }) {
    const closeRef = useRef(null);
    const touchStartX = useRef(null);
    const photo = photos[index];
    const hasMany = photos.length > 1;

    const go = (step) => onChange((index + step + photos.length) % photos.length);

    // Teclado
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') onClose();
            if (hasMany && e.key === 'ArrowRight') onChange((index + 1) % photos.length);
            if (hasMany && e.key === 'ArrowLeft') onChange((index - 1 + photos.length) % photos.length);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [index, photos.length, hasMany, onClose, onChange]);

    // Bloquea el scroll de la página y devuelve el foco al cerrar
    useEffect(() => {
        const previousFocus = document.activeElement;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        closeRef.current?.focus();
        return () => {
            document.body.style.overflow = previousOverflow;
            previousFocus?.focus?.();
        };
    }, []);

    const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
    const onTouchEnd = (e) => {
        if (touchStartX.current === null || !hasMany) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touchStartX.current = null;
    };

    if (!photo) return null;

    const navButton = 'absolute top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white text-4xl leading-none';

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label={photo.title}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={onClose}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-white text-3xl leading-none hover:text-gray-300"
                aria-label="Cerrar"
            >
                ✕
            </button>

            {hasMany && (
                <>
                    <button type="button" className={`${navButton} left-2`} aria-label="Foto anterior"
                        onClick={(e) => { e.stopPropagation(); go(-1); }}>‹</button>
                    <button type="button" className={`${navButton} right-2`} aria-label="Foto siguiente"
                        onClick={(e) => { e.stopPropagation(); go(1); }}>›</button>
                </>
            )}

            {/* Click sobre la foto o el texto no cierra */}
            <figure className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
                <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full max-h-[80vh] object-contain rounded-lg"
                />
                <figcaption className="mt-4 text-center">
                    <span className="block text-white text-xl font-bold">{photo.title}</span>
                    <span className="block text-gray-400">
                        {photo.date}
                        {hasMany && ` · ${index + 1} / ${photos.length}`}
                    </span>
                </figcaption>
            </figure>
        </div>
    );
}
