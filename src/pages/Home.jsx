import { Hero } from '../components/Hero';
import { Featured } from '../components/Featured';
import { UpcomingShows } from '../components/UpcomingShows';
import { NewsList } from '../components/NewsList';

export function Home() {
    return (
        <div className="min-h-screen bg-black text-white">
            <Hero />
            <Featured />
            <UpcomingShows />
            <NewsList />
        </div>
    );
}