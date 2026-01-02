import { useState, useEffect } from 'react'
import { collection, query, limit, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/config'

export function useFeatured() {
    const [featured, setFeatured] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const q = query(collection(db, 'featured'), limit(1))

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                if (!snapshot.empty) {
                    setFeatured({
                        id: snapshot.docs[0].id,
                        ...snapshot.docs[0].data()
                    })
                }
                setLoading(false)
            },
            (error) => {
                console.error('Error fetching featured:', error)
                setError(error.message)
                setLoading(false)
            }
        )

        return () => unsubscribe()
    }, [])

    return { featured, loading, error }
}