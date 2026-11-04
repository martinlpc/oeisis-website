import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { Button, Field, inputClass } from "../components/admin/ui"

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
        } catch {
            setError('Email o contraseña incorrectos')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen text-white flex items-center justify-center px-4">
            <div className="max-w-sm w-full">
                <div className="text-center mb-8">
                    <svg className="w-32 h-16 mx-auto mb-4" viewBox="0 30 100 50" aria-hidden="true"><image width="100" height="100" href="/logo.svg" /></svg>
                    <h1 className="text-xl font-bold">Panel de administración</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 border border-white/10 bg-white/[0.02] rounded-lg p-6">
                    {error && (
                        <p role="alert" className="p-3 rounded border border-red-500/40 text-red-300 text-sm">{error}</p>
                    )}

                    <Field label="Email">
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className={inputClass} />
                    </Field>

                    <Field label="Contraseña">
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" className={inputClass} />
                    </Field>

                    <Button type="submit" disabled={loading} className="w-full py-3">
                        {loading ? 'Ingresando...' : 'Ingresar'}
                    </Button>
                </form>
            </div>
        </div>
    )
}
