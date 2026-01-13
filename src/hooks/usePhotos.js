import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

export function usePhotos() {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const q = query(collection(db, 'photos'), orderBy('date', 'desc'));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const photosData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setPhotos(photosData);
                setLoading(false);
            },
            (error) => {
                console.error('Error fetching photos:', error);
                setError(error.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return { photos, loading, error };
}