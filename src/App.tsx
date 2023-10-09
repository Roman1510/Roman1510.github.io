import Navbar from '@/components/navbar/Navbar';
import { publicRoutes } from '@/router/routes';
import { Route, Routes } from 'react-router-dom';
import { OrbitSpace } from 'orbit-space'


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
      <OrbitSpace />
    </>
  );
}

export default App;