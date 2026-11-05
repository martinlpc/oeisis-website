import { collection, query, doc, getDoc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { useCollection } from './useCollection';
import { DEFAULT_TIME_ZONE, getShowTimeZone, todayInZone } from '../utils/timezones';
import { prepareEnglish } from '../i18n/prepareEnglish';

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

// Un show pasa a "anterior" cuando termina su día en la zona horaria del lugar
export function isPastShow(show) {
    const iso = getShowISO(show);
    return iso ? iso < todayInZone(getShowTimeZone(show)) : false;
}

const showsQuery = () => query(collection(db, 'shows'));

// Más próximo primero; los que no tienen fecha válida van al final
const sortByDate = (shows) =>
    [...shows].sort((a, b) => (getShowISO(a) || '9999').localeCompare(getShowISO(b) || '9999'));

// Se filtra en el cliente porque los shows viejos todavía pueden no tener dateISO
const upcomingSorted = (shows) => sortByDate(shows.filter(show => !isPastShow(show)));

// data.date llega del input como "YYYY-MM-DD". Devuelve { translated } (ver prepareEnglish).
export async function createShow(data) {
    const { data: show, translated } = await prepareEnglish('shows', {
        title: data.title,
        date: formatDisplayDate(data.date),
        dateISO: data.date,
        time: data.time,
        timeZone: data.timeZone || DEFAULT_TIME_ZONE,
        location: {
            venue: data.venue,
            city: data.city,
            province: data.province,
            address: data.address,
            country: data.country,
        },
        ticketLink: data.ticketLink,
        freeEntry: Boolean(data.freeEntry),
        description: data.description,
        flyer: data.flyer || '',
        flyerOg: data.flyerOg || '',
    });
    await addDoc(collection(db, 'shows'), { ...show, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    return { translated };
}

export async function updateShow(id, data) {
    const ref = doc(db, 'shows', id);
    const { data: changes, translated } = await prepareEnglish('shows', data, ref);
    await updateDoc(ref, { ...changes, updatedAt: serverTimestamp() });
    return { translated };
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

// Un show por id (página del show). status: loading | ready | not-found | error
export function useShow(id) {
    // Se guarda el id junto al resultado: si cambia el id, el resultado viejo no aplica y se ve "loading"
    const [result, setResult] = useState({ id: null, show: null, status: 'loading' });

    useEffect(() => {
        let cancelled = false;
        getDoc(doc(db, 'shows', id))
            .then(snapshot => {
                if (cancelled) return;
                setResult(snapshot.exists()
                    ? { id, show: { id: snapshot.id, ...snapshot.data() }, status: 'ready' }
                    : { id, show: null, status: 'not-found' });
            })
            .catch(error => {
                console.error('Error fetching show:', error);
                if (!cancelled) setResult({ id, show: null, status: 'error' });
            });
        return () => { cancelled = true; };
    }, [id]);

    return result.id === id ? result : { show: null, status: 'loading' };
}
