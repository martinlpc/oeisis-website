import { useState, useEffect } from 'react'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/config'

export function useNews() {
    const [news, setNews] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'))

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const newsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                setNews(newsData)
                setLoading(false)
            },
            (error) => {
                console.error('Error fetching news:', error)
                setError(error.message)
                setLoading(false)
            }
        )

        return () => unsubscribe()
    }, [])

    return { news, loading, error }
}