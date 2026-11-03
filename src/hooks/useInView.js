import { useEffect, useState } from "react";

// Devuelve un callback ref: varias secciones montan el elemento recién después del loading,
// así que el observer se engancha cuando el nodo existe, no en el primer render.
export function useInView({ threshold = 0.1, rootMargin = '0px' } = {}) {
    const [node, setNode] = useState(null)
    const [isInView, setIsInView] = useState(false)

    useEffect(() => {
        if (!node || isInView) return

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsInView(true)
                observer.disconnect()
            }
        }, { threshold, rootMargin })

        observer.observe(node)

        return () => observer.disconnect()
    }, [node, isInView, threshold, rootMargin])

    return [setNode, isInView]
}
