import { useState, useEffect } from 'react'
import { collection, query, limit, onSnapshot, doc, setDoc } from 'firebase/firestore'
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

    const updateFeatured = async (data, id = 'current') => {
        try {
            await setDoc(doc(db, 'featured', id), data, { merge: true })
            return true
        } catch (error) {
            console.error('Error updating featured:', error)
            throw error
        }
    }

    return { featured, loading, error, updateFeatured }
}