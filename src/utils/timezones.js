// Zonas horarias de los shows.
// Fecha y hora se cargan como hora local del lugar (como figuran en el flyer)
// y cada show guarda su zona IANA (ej: "Europe/Madrid"). Los shows viejos sin zona son de Argentina.

// Nombre canónico de la zona (ej: "America/Argentina/Buenos_Aires" -> "America/Buenos_Aires"),
// así una misma zona escrita de dos formas se reconoce como la misma
export function canonicalTimeZone(timeZone) {
    try {
        return new Intl.DateTimeFormat('en-US', { timeZone }).resolvedOptions().timeZone
    } catch {
        return null
    }
}

export const DEFAULT_TIME_ZONE = canonicalTimeZone('America/Argentina/Buenos_Aires')

// Zona sugerida al escribir el país. Para países con varias zonas se sugiere la de la capital
// y se puede cambiar a mano en el formulario.
const COUNTRY_TIME_ZONES = {
    argentina: 'America/Argentina/Buenos_Aires',
    espana: 'Europe/Madrid',
    spain: 'Europe/Madrid',
    mexico: 'America/Mexico_City',
    chile: 'America/Santiago',
    uruguay: 'America/Montevideo',
    paraguay: 'America/Asuncion',
    bolivia: 'America/La_Paz',
    peru: 'America/Lima',
    colombia: 'America/Bogota',
    ecuador: 'America/Guayaquil',
    venezuela: 'America/Caracas',
    brasil: 'America/Sao_Paulo',
    brazil: 'America/Sao_Paulo',
    'costa rica': 'America/Costa_Rica',
    panama: 'America/Panama',
    'republica dominicana': 'America/Santo_Domingo',
    'puerto rico': 'America/Puerto_Rico',
    'estados unidos': 'America/New_York',
    'ee uu': 'America/New_York',
    usa: 'America/New_York',
    canada: 'America/Toronto',
    'reino unido': 'Europe/London',
    inglaterra: 'Europe/London',
    irlanda: 'Europe/Dublin',
    portugal: 'Europe/Lisbon',
    francia: 'Europe/Paris',
    italia: 'Europe/Rome',
    alemania: 'Europe/Berlin',
    'paises bajos': 'Europe/Amsterdam',
    holanda: 'Europe/Amsterdam',
    japon: 'Asia/Tokyo',
    australia: 'Australia/Sydney',
}

const normalize = (text) => String(text || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[.]/g, '').trim()

export function guessTimeZone(country) {
    const zone = COUNTRY_TIME_ZONES[normalize(country)]
    return zone ? canonicalTimeZone(zone) : null
}

// Ciudades que no coinciden con el nombre de su zona
const CITY_ALIASES = {
    'ciudad de mexico': 'America/Mexico_City',
    cdmx: 'America/Mexico_City',
    caba: 'America/Argentina/Buenos_Aires',
    'nueva york': 'America/New_York',
    londres: 'Europe/London',
    'san pablo': 'America/Sao_Paulo',
    'sao paulo': 'America/Sao_Paulo',
    lisboa: 'Europe/Lisbon',
    roma: 'Europe/Rome',
    paris: 'Europe/Paris',
    berlin: 'Europe/Berlin',
}

// Zona a partir de la ciudad, cuando la ciudad tiene zona propia (Ciudad Juárez, Cancún, Tijuana, Los Ángeles...)
export function guessTimeZoneFromCity(city) {
    const key = normalize(city)
    if (!key) return null
    if (CITY_ALIASES[key]) return canonicalTimeZone(CITY_ALIASES[key])
    const wanted = key.replace(/\s+/g, '_')
    const match = listTimeZones().find(zone => normalize(zone.split('/').pop()) === wanted)
    return match || null
}

export function isDefaultTimeZone(timeZone) {
    return canonicalTimeZone(timeZone) === DEFAULT_TIME_ZONE
}

export function isValidTimeZone(timeZone) {
    try {
        new Intl.DateTimeFormat('en-US', { timeZone })
        return Boolean(timeZone)
    } catch {
        return false
    }
}

export function getShowTimeZone(show) {
    return isValidTimeZone(show?.timeZone) ? canonicalTimeZone(show.timeZone) : DEFAULT_TIME_ZONE
}

// Todas las zonas que conoce el navegador, para el autocompletado del admin
export function listTimeZones() {
    return typeof Intl.supportedValuesOf === 'function' ? Intl.supportedValuesOf('timeZone') : []
}

// "YYYY-MM-DD" de hoy en una zona
export function todayInZone(timeZone) {
    return new Intl.DateTimeFormat('en-CA', { timeZone }).format(new Date())
}

// Diferencia en ms entre la hora local de la zona y UTC para un instante dado
function offsetMs(date, timeZone) {
    const parts = Object.fromEntries(
        new Intl.DateTimeFormat('en-US', {
            timeZone, hourCycle: 'h23',
            year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
        }).formatToParts(date).map(p => [p.type, p.value])
    )
    const asUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second)
    return asUtc - date.getTime()
}

// Fecha y hora locales de una zona -> instante real (Date). Tiene en cuenta el horario de verano.
export function zonedTimeToDate(dateISO, time, timeZone) {
    const [year, month, day] = dateISO.split('-').map(Number)
    const [hour, minute] = time.split(':').map(Number)
    const asUtc = Date.UTC(year, month - 1, day, hour, minute)
    let result = asUtc - offsetMs(new Date(asUtc), timeZone)
    // Segunda pasada por si el cambio de horario cae entre la estimación y el resultado
    const corrected = asUtc - offsetMs(new Date(result), timeZone)
    if (corrected !== result) result = corrected
    return new Date(result)
}

// Texto que acompaña la hora: "hora de Madrid" en shows fuera de Argentina.
// En inglés se aclara siempre, porque el visitante suele estar en otro país: "Buenos Aires time".
export function timeZoneLabel(show, lang = 'es') {
    const city = show.location?.city
    if (lang === 'en') return city ? `${city} time` : 'local time'
    if (isDefaultTimeZone(getShowTimeZone(show))) return null
    return city ? `hora de ${city}` : 'hora local'
}

// "21:00 hs (hora de Madrid)" o, en inglés, "9:00 PM (Madrid time)"
export function formatShowTimeText(show, lang = 'es') {
    if (!show.time) return ''
    const label = timeZoneLabel(show, lang)
    let time = `${show.time} hs`
    if (lang === 'en') {
        const [h, m] = show.time.split(':').map(Number)
        time = Number.isNaN(h) ? show.time : `${h % 12 || 12}:${String(m || 0).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`
    }
    return `${time}${label ? ` (${label})` : ''}`
}

// Hora actual en una zona, para confirmar en el admin que es la correcta
export function nowInZone(timeZone) {
    try {
        return new Intl.DateTimeFormat('es-AR', { timeZone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date())
    } catch {
        return null
    }
}
