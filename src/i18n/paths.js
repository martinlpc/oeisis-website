// Rutas por idioma: español en "/", inglés en "/en". Sin React: lo usa también la edge function.
// Las rutas se escriben siempre en su forma en español ("/prensa", "/shows/x", "/#contacto").

// Equivalencias de rutas que cambian de nombre
const EN_SEGMENTS = { '/prensa': '/press' }

// "/prensa" -> "/en/press"; "/#contacto" -> "/en#contacto"
export function localizePath(lang, path) {
    if (lang !== 'en') return path
    const [, pathname = '/', rest = ''] = path.match(/^([^?#]*)(.*)$/) || []
    const mapped = EN_SEGMENTS[pathname] || pathname
    return `/en${mapped === '/' ? '' : mapped}${rest}`
}

// "/en/press" -> { lang: 'en', path: '/prensa' }
export function parsePath(pathname) {
    const match = pathname.match(/^\/en(\/.*)?$/)
    if (!match) return { lang: 'es', path: pathname || '/' }
    const rest = match[1] && match[1] !== '/' ? match[1].replace(/\/$/, '') : '/'
    const back = Object.entries(EN_SEGMENTS).find(([, en]) => en === rest)
    return { lang: 'en', path: back ? back[0] : rest }
}

// La misma página en el otro idioma
export function alternatePath(pathname, lang) {
    return localizePath(lang, parsePath(pathname).path)
}
