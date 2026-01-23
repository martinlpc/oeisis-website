import { useInView } from "../../hooks/useInView"
import { useState, useEffect, useRef } from "react"

export function Hero() {
    const [ref, isInView] = useInView()
    const [scrollY, setScrollY] = useState(0)
    const rafRef = useRef(null)

    const HERO_VIDEO_URL = "https://res.cloudinary.com/duf2yqpa1/video/upload/q_auto,f_auto,w_1920,br_500k/v1768500545/video_hello_eii3lq.mp4";

    // Video para mobile (más liviano)
    const HERO_VIDEO_MOBILE_URL = "https://res.cloudinary.com/duf2yqpa1/video/upload/q_auto,f_auto,w_768,br_300k/v1768500545/video_hello_eii3lq.mp4";

    // Poster optimizado (primera frame del video como JPG)
    const POSTER_URL = "https://res.cloudinary.com/duf2yqpa1/video/upload/so_0,q_auto,f_auto,w_1920/v1768500545/video_hello_eii3lq.jpg";


    // ⚡ Scroll con requestAnimationFrame (60fps smooth)
    useEffect(() => {
        let ticking = false

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setScrollY(window.scrollY)
                    ticking = false
                })
                ticking = true
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current)
            }
        }
    }, [])

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    const videoUrl = isMobile ? HERO_VIDEO_MOBILE_URL : HERO_VIDEO_URL

    return (
        <section
            ref={ref}
            className={`overflow-hidden relative w-full h-screen flex flex-col items-center justify-center transition-opacity duration-1000 ${isInView ? 'opacity-100' : 'opacity-0'}`}
        >
            {/** Video background con parallax */}
            <div
                className="absolute inset-0 w-full h-full"
                style={{
                    transform: `translate3D(0, ${scrollY * 0.5}px, 0)`,
                    willChange: 'transform'
                }}
            >
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster={POSTER_URL}
                    className="w-full h-full object-cover"
                    preload="metadata"
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
                    destination?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="absolute bottom-16 bg-white/20 rounded-full p-3 hover:bg-white/30 transition opacity-70 animate-bounce flex flex-col items-center justify-center gap-2"
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