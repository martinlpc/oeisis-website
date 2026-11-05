import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import './index.css';
import { Home } from './pages/Home';
import { ScrollManager } from './components/ScrollManager';
import { LangLayout } from './i18n/LangLayout';

//Lazy load
const Admin = lazy(() => import('./pages/Admin').then(module => ({ default: module.Admin })))
const Login = lazy(() => import('./pages/Login').then(module => ({ default: module.Login })))
const ShowPage = lazy(() => import('./pages/ShowPage').then(module => ({ default: module.ShowPage })))
const PressPage = lazy(() => import('./pages/PressPage').then(module => ({ default: module.PressPage })))
const NotFound = lazy(() => import('./pages/NotFound').then(module => ({ default: module.NotFound })))
// PrivateRoute usa Firebase Auth: cargarlo lazy lo saca del bundle de la home
const PrivateRoute = lazy(() => import('./PrivateRoute').then(module => ({ default: module.PrivateRoute })))

//Loading mientras carga rutas Lazy
function RouteLoader() {
  const english = window.location.pathname.startsWith('/en')
  return (
    <div className='min-h-screen bg-black flex items-center justify-center'>
      <div className='text-white text-xl'>{english ? 'Loading...' : 'Cargando...'}</div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <ScrollManager />
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          {/* Sitio público: español en "/", inglés en "/en" */}
          <Route element={<LangLayout lang="es" />}>
            <Route path="/" element={<Home />} />
            <Route path="/shows/:id" element={<ShowPage />} />
            <Route path="/prensa" element={<PressPage />} />
          </Route>
          <Route path="/en" element={<LangLayout lang="en" />}>
            <Route index element={<Home />} />
            <Route path="shows/:id" element={<ShowPage />} />
            <Route path="press" element={<PressPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route
            path='/admin'
            element={
              <PrivateRoute>
                <Admin />
              </PrivateRoute>
            }
          />
          <Route element={<LangLayout lang="es" />}>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
