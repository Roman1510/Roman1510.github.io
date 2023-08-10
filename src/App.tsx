import Navbar from '@/components/navbar/Navbar'

import { publicRoutes } from '@/router/routes'
import { Route, Routes } from 'react-router-dom'
import ParticleBackground from './components/background/ParticleBackground'
function App() {

  return (
    <>

      <Navbar />
      <ParticleBackground />
      <Routes>
        {publicRoutes.map((route) => {
          return <Route
            key={route.path}
            element={route.element}
            path={route.path}
          />
        })}
      </Routes>
    </>
  )
}

export default App
