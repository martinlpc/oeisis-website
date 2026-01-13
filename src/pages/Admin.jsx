import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'
import { AdminShowForm } from '../components/admin/AdminShowForm';
import { ShowsManager } from '../components/admin/ShowsManager';
import { NewsForm } from '../components/admin/NewsForm';
import { FeaturedForm } from '../components/admin/FeaturedForm';

export function Admin() {
    const { logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    return (
        <div className="min-h-screen  text-white">
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

            <div className="max-w-7xl mx-auto py-8 px-4">
                {/* SECCIÓN 1: SHOWS */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold mb-6 pb-2 border-b border-blue-600">
                        📅 Gestión de Shows
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="border border-gray-700 rounded-lg p-6">
                            <h3 className="text-2xl font-bold mb-6">Crear Show</h3>
                            <AdminShowForm />
                        </div>

                        <div className="border border-gray-700 rounded-lg p-6">
                            <h3 className="text-2xl font-bold mb-6">Editar/Eliminar Shows</h3>
                            <ShowsManager />
                        </div>
                    </div>
                </div>

                {/* SECCIÓN 2: NOTICIAS */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold mb-6 pb-2 border-b border-green-600">
                        📰 Gestión de Noticias
                    </h2>
                    <div className="border border-gray-700 rounded-lg p-6">
                        <h3 className="text-2xl font-bold mb-6">Crear Noticia</h3>
                        <NewsForm />
                    </div>
                </div>

                {/* SECCIÓN 3: DESTACADO */}
                <div>
                    <h2 className="text-3xl font-bold mb-6 pb-2 border-b border-purple-600">
                        ⭐ Sección Destacada
                    </h2>
                    <div className="border border-gray-700 rounded-lg p-6">
                        <FeaturedForm />
                    </div>
                </div>
            </div>
        </div >
    );
}
