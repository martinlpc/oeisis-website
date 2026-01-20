import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
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

    const createPhoto = async (data) => {
        try {
            await addDoc(collection(db, 'photos'), {
                title: data.title,
                imageUrl: data.imageUrl,
                date: data.date,
                album: data.album || ''
            })
            return true
        } catch (error) {
            console.error('Error creating photo:', error);
            throw error
        }
    }

    const updatePhoto = async (id, data) => {
        try {
            await updateDoc(doc(db, 'photos', id), data)
            return true
        } catch (error) {
            console.error('Error updating photo:', error);
            throw error
        }
    }

    const deletePhoto = async (id) => {
        try {
            await deleteDoc(doc(db, 'photos', id))
            return true
        } catch (error) {
            console.error('Error deleting photo:', error)
            throw error
        }
    }

    return { photos, loading, error, createPhoto, updatePhoto, deletePhoto };
}