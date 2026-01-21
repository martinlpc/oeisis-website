// src/hooks/useShows.js
import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export function useShows() {
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const q = query(collection(db, 'shows'));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const showsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                // Ordenar por fecha (más próximo primero)
                showsData.sort((a, b) => {
                    const dateA = new Date(a.date.split(' ').filter(p => p !== 'de').reverse().join('-'));
                    const dateB = new Date(b.date.split(' ').filter(p => p !== 'de').reverse().join('-'));
                    return dateA - dateB;
                });

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
    }, []);

    const createShow = async (data) => {
        try {
            // Convertir fecha de YYYY-MM-DD a "DD MMM YYYY"
            const [year, month, day] = data.date.split('-');
            const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
            const formattedDate = `${day} ${months[parseInt(month) - 1]} ${year}`;

            const docData = {
                title: data.title,
                status: data.status,
                date: formattedDate,
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
            await updateDoc(doc(db, 'shows', id), data)
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

    const formatDateToInput = (dateString) => {
        // "09 ene 2026" -> "2026-01-09"
        const months = {
            ene: '01', feb: '02', mar: '03', abr: '04', may: '05', jun: '06',
            jul: '07', ago: '08', sep: '09', oct: '10', nov: '11', dic: '12'
        };
        const parts = dateString.split(' ').filter(p => p !== 'de');
        const day = parts[0].padStart(2, '0');
        const month = months[parts[1]];
        const year = parts[2];

        return `${year}-${month}-${day}`
    }

    const formatDateFromInput = (dateString) => {
        // "2026-01-09" -> "09 ene 2026"
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('es-AR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).replace(/ de /g, ' ') // Elimina 'de' entre los digitos de la fecha
    }

    return { shows, loading, error, createShow, updateShow, deleteShow, formatDateFromInput, formatDateToInput };
}