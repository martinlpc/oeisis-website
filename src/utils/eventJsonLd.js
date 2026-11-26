// Datos estructurados del show (schema.org MusicEvent), para que Google lo muestre como evento.
// Sin Firebase ni Vite: lo usan la página del show y la edge function, así salen iguales.
import { getShowTimeZone, zonedTimeToDate } from './timezones.js'
import { currencyForShow } from './currency.js'

// No se guarda en el show: un show dura unas 2 horas (lo mismo que se usa para el calendario)
const DURATION_HOURS = 2

// iso: fecha "YYYY-MM-DD" del show
export function buildEventJsonLd(show, { iso, pageUrl }) {
    if (!iso) return null
    const time = /^\d{2}:\d{2}$/.test(show.time || '') ? show.time : '21:00'
    const zone = getShowTimeZone(show)
    const start = zonedTimeToDate(iso, time, zone)
    const end = new Date(start.getTime() + DURATION_HOURS * 3600 * 1000)
    const { venue, address, city, province, country } = show.location || {}
    const origin = pageUrl ? new URL(pageUrl).origin : undefined
    const price = show.freeEntry ? 0 : (typeof show.ticketPrice === 'number' ? show.ticketPrice : undefined)
    // "Venta desde": medianoche de ese día, en la hora local del show
    const validFrom = /^\d{4}-\d{2}-\d{2}$/.test(show.ticketsOnSale || '')
        ? zonedTimeToDate(show.ticketsOnSale, '00:00', zone).toISOString()
        : undefined
    return {
        '@context': 'https://schema.org',
        '@type': 'MusicEvent',
        name: `Oeisis: ${show.title}`,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
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
        organizer: { '@type': 'Organization', name: 'Oeisis', url: origin },
        offers: show.ticketLink || show.freeEntry
            ? {
                '@type': 'Offer',
                url: show.ticketLink || pageUrl,
                availability: 'https://schema.org/InStock',
                price,
                priceCurrency: currencyForShow(show) || undefined,
                validFrom,
            }
            : undefined,
        isAccessibleForFree: show.freeEntry || undefined,
    }
}
