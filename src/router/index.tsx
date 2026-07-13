import { createBrowserRouter, Outlet } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BottomNav } from '@/components/layout/BottomNav'
import { Home } from '@/pages/Home'
import { Listing } from '@/pages/Listing'
import { Detail } from '@/pages/Detail'
import { MapView } from '@/pages/MapView'
import { Insights } from '@/pages/Insights'
import { Favorites } from '@/pages/Favorites'
import { Publish } from '@/pages/Publish'
import { NotFound } from '@/pages/NotFound'

function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg)]">
      <Header />
      <main className="flex-1 pb-24 md:pb-12">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </div>
  )
}

function MapLayout() {
  return (
    <div className="flex h-screen flex-col bg-[var(--color-bg)]">
      <Header />
      <main className="relative flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/list', element: <Listing /> },
      { path: '/list/:id', element: <Detail /> },
      { path: '/insights', element: <Insights /> },
      { path: '/favorites', element: <Favorites /> },
      { path: '/publish', element: <Publish /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    element: <MapLayout />,
    children: [{ path: '/map', element: <MapView /> }],
  },
])
