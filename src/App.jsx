import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
// FIXED: Added the missing import for Register!
import Register from './pages/register.jsx'; 

import Layout from './component/Layout.jsx'; 
import ProtectedRoute from './component/ProtectedRoute.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, 
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        )
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/register",
        element: <Register />
      }
    ]
  }
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;