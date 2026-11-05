// Idioma del sitio público: español en "/", inglés en "/en".
// Las rutas se escriben siempre en su forma en español ("/prensa", "/shows/x", "/#contacto")
// y path() las pasa al idioma actual.
import { createContext, useContext } from 'react'
import { STRINGS } from './strings'
import { localizePath } from './paths'

export { localizePath, parsePath, alternatePath } from './paths'

export const LANGS = ['es', 'en']
export const LOCALES = { es: 'es-AR', en: 'en-US' }

export const LangContext = createContext('es')

export function translate(lang, key, vars) {
    const text = STRINGS[lang]?.[key] ?? STRINGS.es[key] ?? key
    return vars ? text.replace(/\{(\w+)\}/g, (match, name) => (name in vars ? vars[name] : match)) : text
}

// La elección manual le gana a la detección automática del navegador
export function rememberLang(lang) {
    try {
        document.cookie = `lang=${lang}; path=/; max-age=31536000; samesite=lax`
    } catch {
        // sin cookies sigue funcionando, solo no se recuerda
    }
}

export function useLang() {
    const lang = useContext(LangContext)
    return {
        lang,
        locale: LOCALES[lang],
        t: (key, vars) => translate(lang, key, vars),
        path: (path) => localizePath(lang, path),
    }
}
