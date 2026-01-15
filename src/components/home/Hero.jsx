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
            className={`overflow-hidden relative w-full h-screen flex items-center justify-center transition-opacity duration-1000 ${isInView ? 'opacity-100' : 'opacity-0'}`}
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
            <div className="relative z-10 pointer-events-auto text-center text-white">
                <svg className="w-full max-w-md mx-auto" viewBox="0 0 100 100">
                    <image
                        width="100"
                        height="100"
                        href="/logo.svg"
                    />
                </svg>
                <p className="text-xl">Tributo a Oasis | Oasis tribute band</p>
            </div>
        </section>
    )
}