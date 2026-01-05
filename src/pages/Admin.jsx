import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AdminShowForm } from '../components/AdminShowForm';
import { NewsForm } from '../components/NewsForm';

export function Admin() {
    const { logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <nav className="bg-gray-900 border-b border-gray-700 p-4">
                <div className="max-w-7xl mx-auto">
                    <div>
                        <h1 className="text-2xl font-bold">ADMIN PANEL</h1>
                        <p className="text-gray-400 text-sm">Gestión de contenido</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded font-semibold transition"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8 py-8 px-4">
                    <div className="border border-gray-700 rounded-lg p-6">
                        <h2 className="text-2xl font-bold mb-6">Crear Noticia</h2>
                        <NewsForm />
                    </div>

                    <div className="border border-gray-700 rounded-lg p-6">
                        <h2 className="text-2xl font-bold mb-6">Crear Show</h2>
                        <AdminShowForm />
                    </div>
                </div>
            </div>
        </div>
    );
}