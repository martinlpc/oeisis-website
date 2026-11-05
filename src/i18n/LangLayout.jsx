import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { LangContext, LOCALES } from './lang'

// Envuelve las páginas públicas de cada idioma
export function LangLayout({ lang }) {
    useEffect(() => {
        document.documentElement.lang = LOCALES[lang]
    }, [lang])

    return (
        <LangContext.Provider value={lang}>
            <Outlet />
        </LangContext.Provider>
    )
}
