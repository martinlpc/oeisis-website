// Corre antes de servir cada página pública, en español ("/") y en inglés ("/en"):
//
// 1. Idioma: en la primera visita, si el navegador prefiere inglés, redirige a la versión en inglés.
//    Si la persona eligió un idioma con el botón ES/EN (cookie "lang"), se respeta esa elección.
//    Los bots y las vistas previas (WhatsApp, Google...) no se redirigen: ven la URL que se compartió.
// 2. Meta: completa título, descripción, imagen e idiomas alternativos en el HTML, para las vistas previas
//    (WhatsApp, Instagram, Facebook, X, Telegram, Slack, iMessage) y los buscadores.
//
// La respuesta queda 5 minutos en la CDN de Netlify, guardada aparte por idioma del navegador y por cookie.
import { getDocument } from '../lib/firestore.js'
import { formatShowTimeText } from '../../src/utils/timezones.js'
import { localize, translationStatus } from '../../src/i18n/content.js'
import { localizePath, parsePath } from '../../src/i18n/paths.js'

const SITE = 'Oeisis'

const TEXT = {
    es: {
        homeDescription: 'Tributo a Oasis desde Argentina. La mejor experiencia del clásico británico con una propuesta única y memorable.',
        pressTitle: `Prensa · ${SITE}`,
        pressDescription: 'Kit de prensa de Oeisis: bio, fotos, rider técnico y contacto de contrataciones.',
        free: 'Entrada libre.',
        tickets: 'Entradas a la venta.',
        locale: 'es_AR',
        htmlLang: 'es-AR',
        dateLocale: 'es-AR',
    },
    en: {
        homeDescription: 'Oasis tribute band from Argentina. The best of the British classic, in a unique and memorable show.',
        pressTitle: `Press · ${SITE}`,
        pressDescription: 'Oeisis press kit: bio, photos, technical rider and booking contact.',
        free: 'Free entry.',
        tickets: 'Tickets on sale.',
        locale: 'en_US',
        htmlLang: 'en-US',
        dateLocale: 'en-US',
    },
}

const escape = (text) => String(text ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const absolute = (url, origin) => (!url ? null : url.startsWith('http') ? url : `${origin}${url.startsWith('/') ? '' : '/'}${url}`)

// Vistas previas y buscadores: nunca se redirigen
const BOT_UA = /bot|crawl|spider|slurp|facebookexternalhit|facebookcatalog|whatsapp|telegram|slack|discord|twitter|linkedin|skype|pinterest|embedly|preview|vkshare|redditbot|applebot|google|bing|yandex|baidu|duckduck|semrush|ahrefs/i

// "en-US,en;q=0.9,es;q=0.8" -> 'en'. El primero entre español e inglés según el orden de preferencia.
// Sin el header, o sin ninguno de los dos idiomas, null (queda en la página pedida).
export function preferredLang(header) {
    if (!header) return null
    const ranked = header.split(',')
        .map((part, index) => {
            const [tag, ...params] = part.trim().split(';')
            const q = params.map(p => p.trim()).find(p => p.startsWith('q='))
            return { lang: tag.trim().toLowerCase().split('-')[0], q: q ? Number(q.slice(2)) : 1, index }
        })
        .filter(item => item.q > 0)
        .sort((a, b) => b.q - a.q || a.index - b.index)
    return ranked.find(item => item.lang === 'es' || item.lang === 'en')?.lang || null
}

function cookieLang(request) {
    const match = (request.headers.get('cookie') || '').match(/(?:^|;\s*)lang=(es|en)(?:;|$)/)
    return match ? match[1] : null
}

// "viernes 20 de noviembre · 21:00 hs (hora de Madrid) · Sala But, Madrid"
function describeShow(show, lang) {
    const text = TEXT[lang]
    const parts = []
    if (show.dateISO) {
        const [y, m, d] = show.dateISO.split('-').map(Number)
        parts.push(new Date(Date.UTC(y, m - 1, d, 12)).toLocaleDateString(text.dateLocale, {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
        }))
    } else if (show.date) {
        parts.push(show.date)
    }
    if (show.time) parts.push(formatShowTimeText(show, lang))
    const place = [show.location?.venue, show.location?.city].filter(Boolean).join(', ')
    if (place) parts.push(place)
    const summary = parts.join(' · ')
    const extra = show.freeEntry ? text.free : show.ticketLink ? text.tickets : ''
    return [summary && `${summary.charAt(0).toUpperCase()}${summary.slice(1)}.`, extra, show.description].filter(Boolean).join(' ')
}

// En inglés, un texto que todavía no se tradujo no se usa en la descripción (quedaría en español)
function localizedDoc(collection, doc, lang) {
    if (!doc || lang !== 'en') return doc
    if (translationStatus(collection, doc) === 'current') return localize(collection, doc, lang)
    const copy = { ...doc }
    if (collection === 'shows') delete copy.description
    if (collection === 'press') delete copy.bioShort
    return copy
}

async function metaFor(page, lang, origin) {
    const text = TEXT[lang]
    const pageUrl = (l) => `${origin}${localizePath(l, page)}`
    const base = {
        lang,
        url: pageUrl(lang),
        alternates: { es: pageUrl('es'), en: pageUrl('en') },
        image: `${origin}/og-image.png`,
        imageIsDefault: true,
    }

    if (page === '/') {
        return { ...base, title: `${SITE} | Oasis Tribute`, description: text.homeDescription }
    }

    if (page === '/prensa') {
        const press = localizedDoc('press', await getDocument('press/current'), lang)
        const photo = press?.photos?.[0]
        return {
            ...base,
            title: text.pressTitle,
            description: press?.bioShort || text.pressDescription,
            ...(photo ? { image: absolute(photo.previewUrl || photo.url, origin), imageIsDefault: false } : {}),
        }
    }

    const match = page.match(/^\/shows\/([^/]+)$/)
    if (match) {
        const show = localizedDoc('shows', await getDocument(`shows/${encodeURIComponent(match[1])}`), lang)
        if (!show) return null
        return {
            ...base,
            title: `${show.title} · ${SITE}`,
            ogTitle: `${SITE}: ${show.title}`,
            description: describeShow(show, lang),
            // flyerOg ya viene en 1200x630; los flyers viejos sin esa versión se usan tal cual
            ...(show.flyerOg
                ? { image: absolute(show.flyerOg, origin), imageIsDefault: false, imageSize: { width: 1200, height: 630, type: 'image/jpeg' } }
                : show.flyer ? { image: absolute(show.flyer, origin), imageIsDefault: false } : {}),
        }
    }

    return null
}

function setTag(html, pattern, tag) {
    return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `    ${tag}\n  </head>`)
}

// Corta en una palabra completa: las redes muestran ~125 caracteres, Google ~160
function shorten(text, max) {
    if (text.length <= max) return text
    const cut = text.slice(0, max - 1)
    return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s.,;:·-]+$/, '')}…`
}

export function injectMeta(html, meta) {
    const text = TEXT[meta.lang]
    const title = escape(meta.title)
    const ogTitle = escape(meta.ogTitle || meta.title)
    const description = escape(shorten(meta.description, 160))
    const socialDescription = escape(shorten(meta.description, 120))
    const image = escape(meta.image)
    const url = escape(meta.url)
    const other = meta.lang === 'en' ? 'es' : 'en'

    let out = html
    out = out.replace(/<html lang="[^"]*"/, `<html lang="${text.htmlLang}"`)
    out = setTag(out, /<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    out = setTag(out, /<meta name="description"[^>]*>/, `<meta name="description" content="${description}" />`)
    out = setTag(out, /<meta name="language"[^>]*>/, `<meta name="language" content="${meta.lang}" />`)
    out = setTag(out, /<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />`)
    // La misma página en cada idioma; x-default (el español) para el resto
    out = out.replace(/\s*<link rel="alternate" hreflang="[^"]*"[^>]*>/g, '')
    out = out.replace('</head>', [
        `<link rel="alternate" hreflang="es" href="${escape(meta.alternates.es)}" />`,
        `<link rel="alternate" hreflang="en" href="${escape(meta.alternates.en)}" />`,
        `<link rel="alternate" hreflang="x-default" href="${escape(meta.alternates.es)}" />`,
    ].map(tag => `    ${tag}\n`).join('') + '  </head>')
    out = setTag(out, /<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${url}" />`)
    out = setTag(out, /<meta property="og:locale"[^>]*>/, `<meta property="og:locale" content="${text.locale}" />`)
    out = setTag(out, /<meta property="og:locale:alternate"[^>]*>/, `<meta property="og:locale:alternate" content="${TEXT[other].locale}" />`)
    out = setTag(out, /<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${ogTitle}" />`)
    out = setTag(out, /<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${socialDescription}" />`)
    out = setTag(out, /<meta property="og:image" [^>]*>/, `<meta property="og:image" content="${image}" />`)
    out = setTag(out, /<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${ogTitle}" />`)
    out = setTag(out, /<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${socialDescription}" />`)
    out = setTag(out, /<meta name="twitter:image"[^>]*>/, `<meta name="twitter:image" content="${image}" />`)
    if (meta.imageSize) {
        out = setTag(out, /<meta property="og:image:width"[^>]*>/, `<meta property="og:image:width" content="${meta.imageSize.width}" />`)
        out = setTag(out, /<meta property="og:image:height"[^>]*>/, `<meta property="og:image:height" content="${meta.imageSize.height}" />`)
        out = setTag(out, /<meta property="og:image:type"[^>]*>/, `<meta property="og:image:type" content="${meta.imageSize.type}" />`)
    } else if (!meta.imageIsDefault) {
        // Las medidas declaradas son las de og-image.png; con otra imagen se quitan para que la red la mida
        out = out.replace(/\s*<meta property="og:image:(width|height|type)"[^>]*>/g, '')
    }
    return out
}

export default async (request, context) => {
    const url = new URL(request.url)
    const { lang, path: page } = parsePath(url.pathname.replace(/(.)\/+$/, '$1'))

    // Idioma: la elección guardada manda; si no hay, el idioma del navegador (salvo bots)
    const chosen = cookieLang(request)
    const isBot = BOT_UA.test(request.headers.get('user-agent') || '')
    const wanted = chosen || (isBot ? null : preferredLang(request.headers.get('accept-language')))
    if (wanted && wanted !== lang) {
        return new Response(null, {
            status: 302,
            headers: {
                location: `${localizePath(wanted, page)}${url.search}`,
                'cache-control': 'private, no-store',
                'netlify-cdn-cache-control': 'no-store',
            },
        })
    }

    const meta = await metaFor(page, lang, url.origin)
    const response = await context.next()
    if (!meta || !(response.headers.get('content-type') || '').includes('text/html')) return response

    const html = injectMeta(await response.text(), meta)
    const headers = new Headers(response.headers)
    headers.delete('content-length')
    // El navegador siempre revalida (así un deploy nuevo se ve enseguida); la CDN guarda 5 minutos.
    // Se guarda una copia por cookie de idioma y por idioma del navegador, para no servirle
    // a alguien una página que tendría que haberlo redirigido.
    headers.set('cache-control', 'public, max-age=0, must-revalidate')
    headers.set('netlify-vary', 'cookie=lang,language=en|es')
    // Un bot que prefiere otro idioma no se redirige: esa copia no se guarda, porque una persona
    // con el mismo idioma sí tendría que redirigirse
    const preferred = preferredLang(request.headers.get('accept-language'))
    headers.set('netlify-cdn-cache-control', !chosen && preferred && preferred !== lang
        ? 'no-store'
        : 'public, s-maxage=300, stale-while-revalidate=600')
    return new Response(html, { status: response.status, headers })
}

export const config = {
    path: ['/', '/prensa', '/shows/*', '/en', '/en/', '/en/press', '/en/shows/*'],
    // Permite que Netlify guarde la respuesta según los headers de arriba
    cache: 'manual',
}
