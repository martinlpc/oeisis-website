import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import './index.css';
import { Home } from './pages/Home';
import { ScrollManager } from './components/ScrollManager';

//Lazy load
const Admin = lazy(() => import('./pages/Admin').then(module => ({ default: module.Admin })))
const Login = lazy(() => import('./pages/Login').then(module => ({ default: module.Login })))
const ShowPage = lazy(() => import('./pages/ShowPage').then(module => ({ default: module.ShowPage })))
const NotFound = lazy(() => import('./pages/NotFound').then(module => ({ default: module.NotFound })))
// PrivateRoute usa Firebase Auth: cargarlo lazy lo saca del bundle de la home
const PrivateRoute = lazy(() => import('./PrivateRoute').then(module => ({ default: module.PrivateRoute })))

//Loading mientras carga rutas Lazy
function RouteLoader() {
  return (
    <div className='min-h-screen bg-black flex items-center justify-center'>
      <div className='text-white text-xl'>Cargando...</div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <ScrollManager />
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shows/:id" element={<ShowPage />} />
          <Route path="/login" element={<Login />} />
          <Route
            path='/admin'
            element={
              <PrivateRoute>
                <Admin />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
