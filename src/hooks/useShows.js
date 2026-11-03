import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

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

export function useShows({ upcomingOnly = false } = {}) {
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const q = query(collection(db, 'shows'));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                let showsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                // Se filtra en el cliente porque los shows viejos todavía pueden no tener dateISO
                if (upcomingOnly) {
                    showsData = showsData.filter(show => !isPastShow(show));
                }

                // Más próximo primero; los que no tienen fecha válida van al final
                showsData.sort((a, b) => (getShowISO(a) || '9999').localeCompare(getShowISO(b) || '9999'));

                setShows(showsData);
                setLoading(false);
            },
            (error) => {
                console.error('Error fetching shows:', error);
                setError(error.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [upcomingOnly]);

    // data.date llega del input como "YYYY-MM-DD"
    const createShow = async (data) => {
        try {
            const docData = {
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
            };

            await addDoc(collection(db, 'shows'), docData);
            return true;
        } catch (error) {
            console.error('Error creating show:', error);
            throw error;
        }
    }

    const updateShow = async (id, data) => {
        try {
            await updateDoc(doc(db, 'shows', id), { ...data, updatedAt: serverTimestamp() })
            return true
        } catch (error) {
            console.error('Error updating show:', error);
            throw error
        }
    }

    const deleteShow = async (id) => {
        try {
            await deleteDoc(doc(db, 'shows', id))
            return true
        } catch (error) {
            console.error('Error deleting show:', error);
            throw error
        }
    }

    return { shows, loading, error, createShow, updateShow, deleteShow };
}
