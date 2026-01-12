import { useInView } from "../hooks/useInView"

export function Hero() {
    const [ref, isInView] = useInView()

    return (
        <div
            ref={ref}
            className={`w-full h-screen flex items-center justify-center transition-opacity duration-1000 ${isInView ? 'opacity-100' : 'opacity-0'}`}
        >
            <div className="text-center text-white">
                <svg className="w-full max-w-md mx-auto" viewBox="0 0 100 100">
                    <image
                        width="100"
                        height="100"
                        href="/logo.svg"
                    />
                </svg>
                <p className="text-xl">Tributo a Oasis | Oasis tribute band</p>
            </div>
        </div>
    )
}