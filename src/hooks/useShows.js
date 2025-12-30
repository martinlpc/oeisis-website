// src/hooks/useShows.js
import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

export function useShows() {
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const q = query(collection(db, 'shows'), orderBy('date', 'asc'));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const showsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
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

    return { shows, loading, error };
}