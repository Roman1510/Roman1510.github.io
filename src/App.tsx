import Navbar from '@/components/navbar/Navbar';
import { publicRoutes } from '@/router/routes';
import { Route, Routes } from 'react-router-dom';
import ParticleBackground from './components/background/ParticleBackground';

function App() {
  return (
    <>
      <Navbar />
      <div style={{ position: 'relative' }}>
        <Routes>
          {publicRoutes.map((route) => (
            <Route key={route.path} element={route.element} path={route.path} />
          ))}
        </Routes>
      </div>
      <div style={{ position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', zIndex: -1 }}>
        <ParticleBackground />
      </div>
    </>
  );
}

export default App;