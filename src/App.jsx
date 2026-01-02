import { Hero } from './components/Hero';
import { UpcomingShows } from './components/Upcomingshows';
import { AdminShowForm } from './components/AdminShowForm';
import { NewsForm } from './components/NewsForm';
import { NewsList } from './components/NewsList';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Hero />
      <UpcomingShows />
      <NewsList />
      <NewsForm />
      <AdminShowForm />
    </div>
  );
}

export default App;