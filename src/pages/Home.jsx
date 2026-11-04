import { Navbar } from '../components/home/Navbar';
import { Hero } from '../components/home/Hero';
import { Featured } from '../components/home/featured/Featured';
import { UpcomingShows } from '../components/home/shows/UpcomingShows';
import { NewsList } from '../components/home/news/NewsList';
import { Footer } from '../components/home/Footer';
import { VideoGallery } from '../components/home/videos/VideoGallery';
import { PhotoGallery } from '../components/home/photos/PhotoGallery';
import { useShows } from '../hooks/useShows';

export function Home() {
    // Una sola lectura de shows: la usan la sección de shows y el botón "Entradas" del menú
    const showsState = useShows({ upcomingOnly: true, realtime: false });

    return (
        <div id="top" className="min-h-screen text-white">
            <Navbar nextShow={showsState.shows[0]} />
            <main>
                <Hero />
                <Featured />
                <UpcomingShows {...showsState} />
                <NewsList />
                <VideoGallery />
                <PhotoGallery />
            </main>
            <Footer />
        </div>
    );
}
