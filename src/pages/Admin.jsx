import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FeedbackProvider } from '../components/admin/feedback';
import { Panel } from '../components/admin/ui';
import { AdminShowForm } from '../components/admin/AdminShowForm';
import { ShowsManager } from '../components/admin/ShowsManager';
import { NewsForm } from '../components/admin/NewsForm';
import { NewsManager } from '../components/admin/NewsManager';
import { FeaturedForm } from '../components/admin/FeaturedForm';
import { VideoForm } from '../components/admin/VideoForm';
import { VideoManager } from '../components/admin/VideoManager';
import { PhotoForm } from '../components/admin/PhotoForm';
import { PhotoManager } from '../components/admin/PhotoManager';
import { StorageCleanup } from '../components/admin/StorageCleanup';

// Cada tab: formulario de alta a la izquierda y lista a la derecha
function CreateAndList({ createTitle, create, listTitle, list }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-6 items-start">
            <Panel title={createTitle}>{create}</Panel>
            <Panel title={listTitle}>{list}</Panel>
        </div>
    );
}

const TABS = [
    { id: 'shows', label: 'Shows', render: () => <CreateAndList createTitle="Nuevo show" create={<AdminShowForm />} listTitle="Shows" list={<ShowsManager />} /> },
    { id: 'destacado', label: 'Destacado', render: () => <Panel title="Sección destacada" className="max-w-3xl"><FeaturedForm /></Panel> },
    { id: 'noticias', label: 'Noticias', render: () => <CreateAndList createTitle="Nueva noticia" create={<NewsForm />} listTitle="Noticias" list={<NewsManager />} /> },
    { id: 'videos', label: 'Videos', render: () => <CreateAndList createTitle="Nuevo video" create={<VideoForm />} listTitle="Videos" list={<VideoManager />} /> },
    { id: 'fotos', label: 'Fotos', render: () => <CreateAndList createTitle="Nueva foto" create={<PhotoForm />} listTitle="Fotos" list={<PhotoManager />} /> },
    { id: 'mantenimiento', label: 'Mantenimiento', render: () => <Panel title="Archivos sin uso en Supabase" className="max-w-5xl"><StorageCleanup /></Panel> },
];

// La tab activa queda en la URL (#noticias), así sobrevive a un refresh
const tabFromHash = () => TABS.find(t => `#${t.id}` === window.location.hash)?.id || TABS[0].id;

export function Admin() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [active, setActive] = useState(tabFromHash);

    useEffect(() => {
        const onHash = () => setActive(tabFromHash());
        window.addEventListener('hashchange', onHash);
        return () => window.removeEventListener('hashchange', onHash);
    }, []);

    const selectTab = (id) => {
        setActive(id);
        window.history.replaceState(null, '', `#${id}`);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const tab = TABS.find(t => t.id === active);

    return (
        <FeedbackProvider>
            <div className="min-h-screen text-white">
                <header className="border-b border-white/10 bg-[#141414]">
                    <div className="max-w-7xl mx-auto px-4 pt-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <svg className="w-14 h-7" viewBox="0 30 100 50" aria-hidden="true"><image width="100" height="100" href="/logo.svg" /></svg>
                            <h1 className="text-lg font-bold">
                                <span className="sm:hidden">Admin</span>
                                <span className="hidden sm:inline">Panel de administración</span>
                            </h1>
                        </div>
                        <div className="flex items-center gap-4 text-sm whitespace-nowrap">
                            <a href="/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">Ver sitio</a>
                            <button type="button" onClick={handleLogout} className="text-gray-400 hover:text-white">Cerrar sesión</button>
                        </div>
                    </div>

                    <nav className="max-w-7xl mx-auto px-4 mt-3 overflow-x-auto">
                        <div role="tablist" aria-label="Secciones" className="flex gap-1 min-w-max">
                            {TABS.map(t => (
                                <button
                                    key={t.id}
                                    type="button"
                                    role="tab"
                                    id={`tab-${t.id}`}
                                    aria-selected={active === t.id}
                                    aria-controls="admin-panel"
                                    onClick={() => selectTab(t.id)}
                                    className={`px-4 py-3 text-sm border-b-2 transition ${active === t.id ? 'border-white text-white font-semibold' : 'border-transparent text-gray-400 hover:text-white'}`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </nav>
                </header>

                {/* Solo se monta la tab activa: no se abren listeners de colecciones que no se ven */}
                <main id="admin-panel" role="tabpanel" aria-labelledby={`tab-${active}`} className="max-w-7xl mx-auto px-4 py-8">
                    {tab.render()}
                </main>
            </div>
        </FeedbackProvider>
    );
}
