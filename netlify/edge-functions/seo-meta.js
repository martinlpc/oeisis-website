// Completa título, descripción e imagen de cada página en el HTML, para las vistas previas
// (WhatsApp, Instagram, Facebook, X, Telegram, Slack, iMessage) y los buscadores.
// Se aplica a todas las visitas: muchos servicios de vista previa se presentan como un navegador común.
// Para las personas no cambia nada, la app se arma igual en el navegador.
// La respuesta queda 5 minutos en la CDN de Netlify, así que la mayoría de las visitas no ejecutan la función.
import { getDocument } from '../lib/firestore.js'
import { timeZoneLabel } from '../../src/utils/timezones.js'

const SITE = 'Oeisis'
const DEFAULT_DESCRIPTION = 'Tributo a Oasis desde Argentina. La mejor experiencia del clásico británico con una propuesta única y memorable.'

const escape = (text) => String(text ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const absolute = (url, origin) => (!url ? null : url.startsWith('http') ? url : `${origin}${url.startsWith('/') ? '' : '/'}${url}`)

// "viernes 20 de noviembre · 21:00 hs (hora de Madrid) · Sala But, Madrid"
function describeShow(show) {
    const parts = []
    if (show.dateISO) {
        const [y, m, d] = show.dateISO.split('-').map(Number)
        parts.push(new Date(Date.UTC(y, m - 1, d, 12)).toLocaleDateString('es-AR', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
        }))
    } else if (show.date) {
        parts.push(show.date)
    }
    if (show.time) {
        const label = timeZoneLabel(show)
        parts.push(`${show.time} hs${label ? ` (${label})` : ''}`)
    }
    const place = [show.location?.venue, show.location?.city].filter(Boolean).join(', ')
    if (place) parts.push(place)
    const summary = parts.join(' · ')
    const extra = show.freeEntry ? 'Entrada libre.' : show.ticketLink ? 'Entradas a la venta.' : ''
    return [summary && `${summary.charAt(0).toUpperCase()}${summary.slice(1)}.`, extra, show.description].filter(Boolean).join(' ')
}

async function metaFor(url) {
    const origin = url.origin
    const path = url.pathname.replace(/\/+$/, '') || '/'
    const base = { url: `${origin}${path === '/' ? '/' : path}`, image: `${origin}/og-image.png`, imageIsDefault: true }

    if (path === '/') {
        return { ...base, title: `${SITE} | Oasis Tribute`, description: DEFAULT_DESCRIPTION }
    }

    if (path === '/prensa') {
        const press = await getDocument('press/current')
        const photo = press?.photos?.[0]
        return {
            ...base,
            title: `Prensa · ${SITE}`,
            description: press?.bioShort || 'Kit de prensa de Oeisis: bio, fotos, rider técnico y contacto de contrataciones.',
            ...(photo ? { image: absolute(photo.previewUrl || photo.url, origin), imageIsDefault: false } : {}),
        }
    }

    const match = path.match(/^\/shows\/([^/]+)$/)
    if (match) {
        const show = await getDocument(`shows/${encodeURIComponent(match[1])}`)
        if (!show) return null
        return {
            ...base,
            title: `${show.title} · ${SITE}`,
            ogTitle: `${SITE}: ${show.title}`,
            description: describeShow(show),
            ...(show.flyer ? { image: absolute(show.flyer, origin), imageIsDefault: false } : {}),
        }
    }

    return null
}

function setTag(html, pattern, tag) {
    return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `    ${tag}\n  </head>`)
}

function injectMeta(html, meta) {
    const title = escape(meta.title)
    const ogTitle = escape(meta.ogTitle || meta.title)
    const description = escape(meta.description.length > 300 ? `${meta.description.slice(0, 297)}...` : meta.description)
    const image = escape(meta.image)
    const url = escape(meta.url)

    let out = html
    out = setTag(out, /<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    out = setTag(out, /<meta name="description"[^>]*>/, `<meta name="description" content="${description}" />`)
    out = setTag(out, /<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />`)
    out = setTag(out, /<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${url}" />`)
    out = setTag(out, /<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${ogTitle}" />`)
    out = setTag(out, /<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${description}" />`)
    out = setTag(out, /<meta property="og:image" [^>]*>/, `<meta property="og:image" content="${image}" />`)
    out = setTag(out, /<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${ogTitle}" />`)
    out = setTag(out, /<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${description}" />`)
    out = setTag(out, /<meta name="twitter:image"[^>]*>/, `<meta name="twitter:image" content="${image}" />`)
    if (!meta.imageIsDefault) {
        // Las medidas declaradas son las de og-image.png; con otra imagen se quitan para que la red la mida
        out = out.replace(/\s*<meta property="og:image:(width|height|type)"[^>]*>/g, '')
    }
    return out
}

export default async (request, context) => {
    const url = new URL(request.url)
    const meta = await metaFor(url)
    const response = await context.next()
    if (!meta || !(response.headers.get('content-type') || '').includes('text/html')) return response

    const html = injectMeta(await response.text(), meta)
    const headers = new Headers(response.headers)
    headers.delete('content-length')
    // El navegador siempre revalida (así un deploy nuevo se ve enseguida); la CDN guarda 5 minutos
    headers.set('cache-control', 'public, max-age=0, must-revalidate')
    headers.set('netlify-cdn-cache-control', 'public, s-maxage=300, stale-while-revalidate=600')
    return new Response(html, { status: response.status, headers })
}

export const config = {
    path: ['/', '/prensa', '/shows/*'],
    // Permite que Netlify guarde la respuesta según los headers de arriba
    cache: 'manual',
}
