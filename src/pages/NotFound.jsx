import { Link } from 'react-router-dom'

export function NotFound() {
    return (
        <div className="min-h-screen text-white flex flex-col items-center justify-center px-4 text-center">
            <title>Página no encontrada · Oeisis</title>
            <svg className="w-40 h-20 mb-8" viewBox="0 30 100 50" aria-hidden="true"><image width="100" height="100" href="/logo.svg" /></svg>
            <h1 className="text-3xl font-bold mb-3">Esta página no existe</h1>
            <p className="text-gray-400 mb-8">Puede que el link esté mal o que la página se haya movido.</p>
            <Link to="/" className="btn-double-border text-white font-bold py-3 px-8">Volver al inicio</Link>
        </div>
    )
}
