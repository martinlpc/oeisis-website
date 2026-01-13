import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
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

    return { videos, loading, error }
}