import { Hero } from '../components/Hero';
import { Featured } from '../components/Featured';
import { UpcomingShows } from '../components/UpcomingShows';
import { NewsList } from '../components/NewsList';
import { Footer } from '../components/Footer';

export function Home() {
    return (
        <div className="min-h-screen text-white">
            <Hero />
            <Featured />
            <UpcomingShows />
            <NewsList />
            <Footer />
        </div>
    );
}
