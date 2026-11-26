// Moneda de las entradas (para los datos estructurados del evento).
// Si el show tiene una moneda elegida a mano (ticketCurrency), esa. Si no, se deduce del país.
// Solo si el país está vacío se usa la zona horaria. Un país escrito que no se reconoce da null
// (en el admin se pide elegirla): mejor sin moneda que con una equivocada.

// Para elegir a mano en el admin cuando el país no se reconoce
export const CURRENCIES = ['ARS', 'EUR', 'MXN', 'USD', 'GBP', 'UYU', 'CLP', 'BRL', 'COP', 'PEN', 'PYG', 'BOB', 'CAD', 'AUD', 'JPY', 'CHF']

const BY_COUNTRY = {
    argentina: 'ARS',
    espana: 'EUR', spain: 'EUR',
    portugal: 'EUR',
    francia: 'EUR', france: 'EUR',
    italia: 'EUR', italy: 'EUR',
    alemania: 'EUR', germany: 'EUR',
    irlanda: 'EUR', ireland: 'EUR',
    'reino unido': 'GBP', 'united kingdom': 'GBP', inglaterra: 'GBP', england: 'GBP',
    mexico: 'MXN',
    uruguay: 'UYU',
    chile: 'CLP',
    brasil: 'BRL', brazil: 'BRL',
    colombia: 'COP',
    peru: 'PEN',
    paraguay: 'PYG',
    'estados unidos': 'USD', 'united states': 'USD', usa: 'USD',
    bolivia: 'BOB',
    ecuador: 'USD',
    canada: 'CAD',
    'paises bajos': 'EUR', holanda: 'EUR', netherlands: 'EUR',
    belgica: 'EUR', belgium: 'EUR',
    austria: 'EUR', grecia: 'EUR', greece: 'EUR', finlandia: 'EUR', finland: 'EUR',
    suiza: 'CHF', switzerland: 'CHF',
    japon: 'JPY', japan: 'JPY',
    australia: 'AUD',
}

// Moneda deducida del país o de la zona horaria, sin mirar la elección manual
export function guessCurrency(show) {

const normalize = (text) => String(text || '').normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase()

    const country = normalize(show.location?.country)
    if (country) return BY_COUNTRY[country] || null
    const zone = show.timeZone || ''
    if (zone.startsWith('America/Argentina') || zone === 'America/Buenos_Aires') return 'ARS'
    if (zone === 'Europe/London') return 'GBP'
    if (zone.startsWith('Europe/')) return 'EUR'
    if (/^America\/(Mexico_City|Cancun|Monterrey|Merida|Tijuana|Chihuahua|Ciudad_Juarez|Hermosillo|Mazatlan|Matamoros|Ojinaga|Bahia_Banderas)$/.test(zone)) return 'MXN'
    return null
}

export function currencyForShow(show) {
    return show.ticketCurrency || guessCurrency(show)
}
