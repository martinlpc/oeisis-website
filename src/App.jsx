import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import './index.css';
import { PrivateRoute } from './PrivateRoute';
//import { Admin } from './pages/Admin';
//import { Login } from './pages/Login';

import { Home } from './pages/Home';
import { Modality } from 'firebase/ai';

//Lazy load
const Admin = lazy(() => import('./pages/Admin').then(module => ({ default: module.Admin })))
const Login = lazy(() => import('./pages/Login').then(module => ({ default: module.Login })))

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
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={
            <Suspense fallback={<RouteLoader />}>
              <Login />
            </Suspense>
          }
        />

        <Route
          path='/admin'
          element={
            <Suspense fallback={<RouteLoader />}>
              <PrivateRoute>
                <Admin />
              </PrivateRoute>
            </Suspense>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;