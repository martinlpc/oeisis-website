import { getShowISO } from '../hooks/useShows'
import { getShowTimeZone, formatShowTimeText, zonedTimeToDate } from './timezones'
import { LOCALES } from '../i18n/lang'

// Duración por defecto para el calendario (no se guarda en el show)
const DEFAULT_DURATION_HOURS = 2

// "2026-11-20" -> { weekday: 'VIE', day: '20', month: 'NOV', year: 2026, long: 'viernes 20 de noviembre de 2026' }
// En inglés: { weekday: 'FRI', ..., month: 'NOV', long: 'Friday, November 20, 2026' }
export function getDateParts(show, lang = 'es') {
    const iso = getShowISO(show)
    if (!iso) return null
    const [year, month, day] = iso.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    const locale = LOCALES[lang] || LOCALES.es
    const short = (options) => date.toLocaleDateString(locale, options).replace('.', '').toUpperCase()
    return {
        weekday: short({ weekday: 'short' }),
        day: String(day).padStart(2, '0'),
        month: short({ month: 'short' }),
        year,
        long: date.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
    }
}

// Fecha corta para la lista de shows anteriores: "09 ene" / "Jan 9"
export function shortDate(show, lang = 'es') {
    const iso = getShowISO(show)
    if (!iso) return show.date || ''
    const [year, month, day] = iso.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    if (lang === 'en') return date.toLocaleDateString(LOCALES.en, { month: 'short', day: 'numeric' })
    return `${String(day).padStart(2, '0')} ${date.toLocaleDateString(LOCALES.es, { month: 'short' }).replace('.', '')}`
}

export function getPlace(show) {
    const { venue, address, city, province, country } = show.location || {}
    return { venue, address, city, province, country }
}

const mapsQuery = (show) => {
    const { venue, address, city, province, country } = getPlace(show)
    return [venue, address, city, province, country].filter(Boolean).join(', ')
}

// Link de búsqueda de Google Maps (no necesita API key)
export function getMapsUrl(show) {
    const query = mapsQuery(show)
    return query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` : null
}

// Mapa embebido (Maps Embed API: gratis, pero necesita key). Sin key devuelve null y no se muestra.
const EMBED_KEY = import.meta.env.VITE_GOOGLE_MAPS_EMBED_KEY

export function getMapEmbedUrl(show, lang = 'es') {
    const query = mapsQuery(show)
    if (!EMBED_KEY || !query) return null
    const params = new URLSearchParams({ key: EMBED_KEY, q: query, language: lang })
    return `https://www.google.com/maps/embed/v1/place?${params}`
}

// Inicio y fin reales del show. Fecha y hora están en la hora local del lugar.
export function getShowTimes(show) {
    const iso = getShowISO(show)
    if (!iso) return null
    const time = /^\d{2}:\d{2}$/.test(show.time || '') ? show.time : '21:00'
    const start = zonedTimeToDate(iso, time, getShowTimeZone(show))
    const end = new Date(start.getTime() + DEFAULT_DURATION_HOURS * 3600 * 1000)
    return { start, end }
}

const toCalendarStamp = (date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

const locationText = (show) => {
    const { venue, address, city } = getPlace(show)
    return [venue, address, city].filter(Boolean).join(', ')
}

export function getGoogleCalendarUrl(show, pageUrl) {
    const times = getShowTimes(show)
    if (!times) return null
    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: `Oeisis: ${show.title}`,
        dates: `${toCalendarStamp(times.start)}/${toCalendarStamp(times.end)}`,
        details: [show.description, pageUrl].filter(Boolean).join('\n\n'),
        location: locationText(show),
    })
    return `https://calendar.google.com/calendar/render?${params}`
}

// Archivo .ics para Apple Calendar, Outlook, etc.
export function getIcsContent(show, pageUrl) {
    const times = getShowTimes(show)
    if (!times) return null
    const escape = (text) => String(text || '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/[,;]/g, m => `\\${m}`)
    return [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Oeisis//Shows//ES',
        'BEGIN:VEVENT',
        `UID:${show.id}@oeisis`,
        `DTSTAMP:${toCalendarStamp(new Date())}`,
        `DTSTART:${toCalendarStamp(times.start)}`,
        `DTEND:${toCalendarStamp(times.end)}`,
        `SUMMARY:${escape(`Oeisis: ${show.title}`)}`,
        `LOCATION:${escape(locationText(show))}`,
        `DESCRIPTION:${escape([show.description, pageUrl].filter(Boolean).join('\n\n'))}`,
        pageUrl ? `URL:${pageUrl}` : null,
        'END:VEVENT',
        'END:VCALENDAR',
    ].filter(Boolean).join('\r\n')
}

// Datos estructurados para que Google muestre el show como evento
export function getEventJsonLd(show, pageUrl) {
    const times = getShowTimes(show)
    if (!times) return null
    const { venue, address, city, province, country } = getPlace(show)
    return {
        '@context': 'https://schema.org',
        '@type': 'MusicEvent',
        name: `Oeisis: ${show.title}`,
        startDate: times.start.toISOString(),
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        url: pageUrl,
        description: show.description || undefined,
        location: {
            '@type': 'Place',
            name: venue || city,
            address: {
                '@type': 'PostalAddress',
                streetAddress: address || undefined,
                addressLocality: city || undefined,
                addressRegion: province || undefined,
                addressCountry: country || 'AR',
            },
        },
        image: show.flyer || undefined,
        performer: { '@type': 'MusicGroup', name: 'Oeisis' },
        offers: show.ticketLink
            ? { '@type': 'Offer', url: show.ticketLink, availability: 'https://schema.org/InStock', ...(show.freeEntry ? { price: 0, priceCurrency: 'ARS' } : {}) }
            : undefined,
        isAccessibleForFree: show.freeEntry || undefined,
    }
}

// "21:00 hs" o, fuera de Argentina, "21:00 hs (hora de Madrid)". En inglés: "9:00 PM (Madrid time)"
export function formatShowTime(show, lang = 'es') {
    return formatShowTimeText(show, lang)
}
