// Datos estructurados del show (schema.org MusicEvent), para que Google lo muestre como evento.
// Sin Firebase ni Vite: lo usan la página del show y la edge function, así salen iguales.
import { getShowTimeZone, zonedTimeToDate } from './timezones.js'

// iso: fecha "YYYY-MM-DD" del show
export function buildEventJsonLd(show, { iso, pageUrl }) {
    if (!iso) return null
    const time = /^\d{2}:\d{2}$/.test(show.time || '') ? show.time : '21:00'
    const start = zonedTimeToDate(iso, time, getShowTimeZone(show))
    const { venue, address, city, province, country } = show.location || {}
    return {
        '@context': 'https://schema.org',
        '@type': 'MusicEvent',
        name: `Oeisis: ${show.title}`,
        startDate: start.toISOString(),
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
