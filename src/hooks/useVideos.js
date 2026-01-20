import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebase/config'

export function useVideos() {
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const q = query(collection(db, 'videos'), orderBy('date', 'desc'))

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const videosData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                setVideos(videosData)
                setLoading(false)
            },
            (error) => {
                console.error('Error fetching videos:', error)
                setError(error.message)
                setLoading(false)
            }
        )

        return () => unsubscribe()
    }, [])

    const createVideo = async (data) => {
        try {
            const docData = {
                title: data.title,
                description: data.description,
                embedUrl: data.embedUrl,
                date: data.date,
                featured: data.featured || false,
            }

            await addDoc(collection(db, 'videos'), docData)
            return true
        } catch (error) {
            console.error('Error creating video:', error)
            throw error
        }
    }

    const updateVideo = async (id, data) => {
        try {
            await updateDoc(doc(db, 'videos', id), data)
            return true
        } catch (error) {
            console.error('Error updating video:', error)
            throw error
        }
    }

    const deleteVideo = async (id) => {
        try {
            await deleteDoc(doc(db, 'videos', id))
            return true
        } catch (error) {
            console.error('Error deleting video:', error)
            throw error
        }
    }

    return { videos, loading, error, createVideo, updateVideo, deleteVideo }
}