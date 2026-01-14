import { Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

export function PrivateRoute({ children }) {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen  flex items-center justify-center">
                <p className="text-white text-xl">Cargando...</p>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return children
}