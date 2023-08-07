
import { publicRoutes } from '@/router/routes'
import { Route, Routes } from 'react-router-dom'

const AppRouter = () => {


  return (
    <Routes>
      {publicRoutes.map((route) => {
        return <Route
          key={route.path}
          element={route.element}
          path={route.path}
        />
      })}
    </Routes>
  )
}

export default AppRouter