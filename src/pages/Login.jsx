import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

export function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await login(email, password)
            navigate('/admin')
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            setError('Email o contraseña incorrectos')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2">OEISIS ADMIN</h1>
                    <p className="text-gray-400">Iniciá sesión para continuar</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 bg-gray-900 p-8 rounded-lg border border-gray-700">
                    {error && (
                        <div className="p-4 rounded bg-red-900 border border-red-700 text-red-200">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu@email.com"
                            className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:border-blue-500 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:border-blue-500 outline-none"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white font-bold py-2 rounded transition"
                    >
                        {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                    </button>
                </form>
            </div>
        </div>
    )
}