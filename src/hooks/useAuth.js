import { useState, useEffect } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '../firebase/config'

export function useAuth() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
            setLoading(false)
        })

        return () => unsubscribe()
    })

    const login = async (email, password) => {
        setError(null)
        try {
            await signInWithEmailAndPassword(auth, email, password)
        } catch (error) {
            setError(error.message)
            throw error
        }
    }

    const logout = async () => {
        setError(null)
        try {
            await signOut(auth)
        } catch (error) {
            setError(error.message)
            throw error
        }
    }

    return { user, loading, error, login, logout }
}