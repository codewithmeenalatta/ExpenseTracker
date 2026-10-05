import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// FIXED: Added .jsx to the end of all these files so Vite doesn't crash!
import Home from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
// import Register from './pages/Register.jsx';
// import Register from "./pages/Register.jsx';
import Register from'./pages/Register.jsx';

// FIXED: Changed 'component' to 'components' (with an 's') and added .jsx
import Layout from './component/Layout.jsx'; 
import ProtectedRoute from './component/ProtectedRoute.jsx';

// Define our nested routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, 
    children: [
      {
        path: "/",
        // Our Security Guard wrapping the Dashboard
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
    // We moved the background classes into the Layout component, so App is perfectly clean
    return <RouterProvider router={router} />;
}

export default App;