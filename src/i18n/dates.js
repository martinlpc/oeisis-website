import { LOCALES } from './lang'

const ES_MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

// La fecha de una noticia se guarda como texto en español ("05 de noviembre de 2026").
// En inglés se arma desde createdAt o, si no está, leyendo ese texto.
function newsDate(item) {
    const created = item.createdAt
    if (created?.toDate) return created.toDate()
    if (typeof created?.seconds === 'number') return new Date(created.seconds * 1000)
    const match = String(item.date || '').toLowerCase().match(/(\d{1,2})\s+de\s+([a-záé]+)\s+de\s+(\d{4})/)
    const month = match ? ES_MONTHS.findIndex(m => m.startsWith(match[2].slice(0, 3))) : -1
    return month === -1 ? null : new Date(Number(match[3]), month, Number(match[1]))
}

export function formatNewsDate(item, lang = 'es') {
    if (lang !== 'en') return item.date
    const date = newsDate(item)
    return date ? date.toLocaleDateString(LOCALES.en, { month: 'long', day: 'numeric', year: 'numeric' }) : item.date
}
