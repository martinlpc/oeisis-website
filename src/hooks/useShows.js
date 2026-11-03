import { collection, query, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useCollection } from './useCollection';

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

// "2026-01-09" -> "09 ene 2026" (texto que se muestra en la web)
export function formatDisplayDate(iso) {
    const [year, month, day] = iso.split('-');
    return `${day} ${MONTHS[parseInt(month, 10) - 1]} ${year}`;
}

// "09 ene 2026" (o "09 de ene. de 2026") -> "2026-01-09". Solo para shows viejos sin dateISO.
export function parseLegacyDate(text) {
    const parts = String(text || '')
        .toLowerCase()
        .replace(/\./g, '')
        .split(' ')
        .filter(p => p && p !== 'de');
    const monthIndex = MONTHS.indexOf(parts[1]?.slice(0, 3));
    if (parts.length < 3 || monthIndex === -1) return null;
    return `${parts[2]}-${String(monthIndex + 1).padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
}

export function getShowISO(show) {
    return show.dateISO || parseLegacyDate(show.date);
}

// Fecha de hoy en Argentina como "YYYY-MM-DD"
function todayISO() {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date());
}

export function isPastShow(show) {
    const iso = getShowISO(show);
    return iso ? iso < todayISO() : false;
}

const showsQuery = () => query(collection(db, 'shows'));

// Más próximo primero; los que no tienen fecha válida van al final
const sortByDate = (shows) =>
    [...shows].sort((a, b) => (getShowISO(a) || '9999').localeCompare(getShowISO(b) || '9999'));

// Se filtra en el cliente porque los shows viejos todavía pueden no tener dateISO
const upcomingSorted = (shows) => sortByDate(shows.filter(show => !isPastShow(show)));

// data.date llega del input como "YYYY-MM-DD"
export async function createShow(data) {
    await addDoc(collection(db, 'shows'), {
        title: data.title,
        status: data.status,
        date: formatDisplayDate(data.date),
        dateISO: data.date,
        time: data.time,
        location: {
            venue: data.venue,
            city: data.city,
            province: data.province,
            address: data.address,
            country: data.country,
        },
        ticketLink: data.ticketLink,
        description: data.description,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return true;
}

export async function updateShow(id, data) {
    await updateDoc(doc(db, 'shows', id), { ...data, updatedAt: serverTimestamp() });
    return true;
}

export async function deleteShow(id) {
    await deleteDoc(doc(db, 'shows', id));
    return true;
}

export function useShows({ upcomingOnly = false, realtime = true } = {}) {
    const { data: shows, loading, error } = useCollection(showsQuery, {
        realtime,
        transform: upcomingOnly ? upcomingSorted : sortByDate,
        label: 'shows',
    });
    return { shows, loading, error, createShow, updateShow, deleteShow };
}
