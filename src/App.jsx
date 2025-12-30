import { Hero } from './components/Hero';
import { UpcomingShows } from './components/Upcomingshows';
import { AdminShowForm } from './components/AdminShowForm';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Hero />
      <UpcomingShows />
      <AdminShowForm />
    </div>
  );
}

export default App;