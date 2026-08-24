import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';

// 详情页懒加载：首屏不必拉取详情页代码
const ListingDetailPage = lazy(() => import('./pages/ListingDetailPage'));

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/listing/:id"
        element={
          <Suspense
            fallback={
              <div className="flex min-h-[50vh] items-center justify-center text-sm text-charcoal-400">
                加载中…
              </div>
            }
          >
            <ListingDetailPage />
          </Suspense>
        }
      />
    </Routes>
  );
}
