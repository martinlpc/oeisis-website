import { Hero } from '../components/home/Hero';
import { Featured } from '../components/home/featured/Featured';
import { UpcomingShows } from '../components/home/shows/UpcomingShows';
import { NewsList } from '../components/home/news/NewsList';
import { Footer } from '../components/home/Footer';
import { VideoGallery } from '../components/home/videos/VideoGallery';
import { PhotoGallery } from '../components/home/photos/PhotoGallery';

export function Home() {
    return (
        <div className="min-h-screen text-white">
            <Hero />
            <Featured />
            <UpcomingShows />
            <NewsList />
            <VideoGallery />
            <PhotoGallery />
            <Footer />
        </div>
    );
}
