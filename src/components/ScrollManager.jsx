import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// React Router no maneja el scroll al cambiar de página:
// - sin hash: arranca arriba
// - con hash (/#noticias): baja a esa sección; reintenta un momento después
//   porque las secciones de arriba pueden cambiar de alto al cargar sus datos
export function ScrollManager() {
    const { pathname, hash } = useLocation()

    useEffect(() => {
        if (!hash) {
            window.scrollTo(0, 0)
            return
        }
        const id = decodeURIComponent(hash.slice(1))
        const scroll = () => document.getElementById(id)?.scrollIntoView()
        const timers = [0, 400, 1200].map(ms => setTimeout(scroll, ms))
        return () => timers.forEach(clearTimeout)
    }, [pathname, hash])

    return null
}
