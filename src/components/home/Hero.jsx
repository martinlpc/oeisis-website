import { useEffect, useRef } from "react"
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion"

const HERO_VIDEO_URL = "/videos/hero-720.mp4"
// Video para mobile (más liviano)
const HERO_VIDEO_MOBILE_URL = "/videos/hero-360.mp4"
// Poster optimizado (primer frame del video como JPG)
const POSTER_URL = "/images/hero-poster.jpg"

export function Hero() {
    const parallaxRef = useRef(null)
    const reducedMotion = usePrefersReducedMotion()

    // Parallax: escribe el transform directo en el DOM, sin re-renderizar el componente
    useEffect(() => {
        const layer = parallaxRef.current
        if (!layer) return

        if (reducedMotion) {
            layer.style.transform = ''
            return
        }

        let frame = null

        const update = () => {
            frame = null
            const y = window.scrollY
            // Pasado el Hero no tiene sentido seguir moviéndolo
            if (y > window.innerHeight) return
            layer.style.transform = `translate3d(0, ${y * 0.5}px, 0)`
        }

        const onScroll = () => {
            if (frame === null) frame = window.requestAnimationFrame(update)
        }

        update()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => {
            window.removeEventListener('scroll', onScroll)
            if (frame !== null) window.cancelAnimationFrame(frame)
        }
    }, [reducedMotion])

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    const videoUrl = isMobile ? HERO_VIDEO_MOBILE_URL : HERO_VIDEO_URL

    return (
        <section className="overflow-hidden relative w-full h-screen flex flex-col items-center justify-center">
            {/** Video background con parallax */}
            <div
                ref={parallaxRef}
                className="absolute inset-0 w-full h-full motion-safe:will-change-transform"
            >
                {/* Con movimiento reducido queda el poster fijo, sin video */}
                <video
                    key={reducedMotion ? 'static' : 'motion'}
                    autoPlay={!reducedMotion}
                    muted
                    loop
                    playsInline
                    poster={POSTER_URL}
                    className="w-full h-full object-cover"
                    preload={reducedMotion ? 'none' : 'metadata'}
                    aria-hidden="true"
                >
                    <source src={videoUrl} type="video/mp4" />
                </video>
                {/** Overlay */}
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/** Logo y frase */}
            <div className="relative z-10 pointer-events-auto text-center text-white items-center justify-center">
                <div className="w-40 md:w-64 lg:w-80 mx-auto mb-2">
                    <svg className="w-full" viewBox="0 30 100 50"><image width="100" height="100" href="/logo.svg" /></svg>
                </div>
                <p className="text-lg mb-2">Banda homenaje a Oasis</p>
                <p className="text-lg mb-16">Oasis tribute band</p>
            </div>

            {/** Flecha abajo */}
            <button
                onClick={() => {
                    const destination = document.getElementById('upcoming-shows');
                    destination?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
                }}
                className="absolute bottom-16 bg-white/20 rounded-full p-3 hover:bg-white/30 transition opacity-70 motion-safe:animate-bounce flex flex-col items-center justify-center gap-2"
                aria-label="Ir a shows"
            >
                <span className="text-xs font-semibold tracking-widest uppercase">shows</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden='true'
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                </svg>
            </button>
        </section>
    )
}