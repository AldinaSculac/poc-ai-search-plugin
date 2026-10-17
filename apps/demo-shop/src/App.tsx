import { createBrowserRouter, Navigate } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { Layout } from './components/Layout';
import { CataloguePage } from './pages/CataloguePage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Navigate to="/catalogue" replace /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/catalogue', element: <CataloguePage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '*', element: <Navigate to="/catalogue" replace /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
