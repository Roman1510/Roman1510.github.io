import Navbar from '@/components/navbar/Navbar';
import { publicRoutes } from '@/router/routes';
import { Route, Routes } from 'react-router-dom';



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

    </>
  );
}

export default App;