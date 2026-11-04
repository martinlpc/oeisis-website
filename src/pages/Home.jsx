import { Navbar } from '../components/home/Navbar';
import { Hero } from '../components/home/Hero';
import { Featured } from '../components/home/featured/Featured';
import { UpcomingShows } from '../components/home/shows/UpcomingShows';
import { NewsList } from '../components/home/news/NewsList';
import { Footer } from '../components/home/Footer';
import { VideoGallery } from '../components/home/videos/VideoGallery';
import { PhotoGallery } from '../components/home/photos/PhotoGallery';
import { ContactSection } from '../components/home/ContactSection';
import { useShows, isPastShow } from '../hooks/useShows';

export function Home() {
    // Una sola lectura de shows: próximos (sección y botón "Entradas" del menú) y anteriores
    const { shows, loading, error } = useShows({ realtime: false });
    const upcoming = shows.filter(show => !isPastShow(show));
    const past = shows.filter(isPastShow).reverse();

    return (
        <div id="top" className="min-h-screen text-white">
            <Navbar nextShow={upcoming[0]} />
            <main>
                <Hero />
                <Featured />
                <UpcomingShows shows={upcoming} pastShows={past} loading={loading} error={error} />
                <NewsList />
                <VideoGallery />
                <PhotoGallery />
                <ContactSection />
            </main>
            <Footer />
        </div>
    );
}
