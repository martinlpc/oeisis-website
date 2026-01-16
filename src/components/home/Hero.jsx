import { useInView } from "../../hooks/useInView"
import { useState, useEffect } from "react"

export function Hero() {
    const [ref, isInView] = useInView()
    const [scrollY, setScrollY] = useState(0)

    const HERO_VIDEO_URL = "https://res.cloudinary.com/duf2yqpa1/video/upload/v1768500545/video_hello_eii3lq.mp4"

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY)
        window.addEventListener('scroll', handleScroll)

        return () => window.removeEventListener('scroll', handleScroll)
    }, [])


    return (
        <section
            ref={ref}
            className={`overflow-hidden relative w-full h-screen flex flex-col items-center justify-center transition-opacity duration-1000 ${isInView ? 'opacity-100' : 'opacity-0'}`}
        >
            {/** Video background con parallax */}
            <div
                className="absolute inset-0 w-full h-full"
                style={{ transform: `translateY(${scrollY * 0.5}px)` }}
            >
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src={HERO_VIDEO_URL} type="video/mp4" />
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
                    const featured = document.getElementById('featured-section');
                    featured?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="absolute bottom-8 bg-white/20 rounded-full p-3 hover:bg-white/30 transition opacity-70 animate-bounce flex items-center justify-center"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
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