
import MainPage from '@/pages/MainPage'
import About from '@/pages/About'
import ComingUp from '@/pages/ComingUp'
import Experience from '@/pages/Experience'
import Contact from '@/pages/Contact'

import { Navigate } from 'react-router-dom'
import React from 'react'

export const publicRoutes: Route[] = [
  { path: '/', element: <MainPage /> },
  { path: '/about', element: <About /> },
  { path: '/coming-up', element: <ComingUp /> },
  { path: '/contact', element: <Contact /> },
  { path: '/experience', element: <Experience /> },
  { path: '*', element: <Navigate to="/" /> },
]

type Route = {
  path: string,
  element: React.ReactElement<{}>
}