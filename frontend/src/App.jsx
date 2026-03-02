import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { Navbar } from './components/Navbar'
import { Pastes } from './components/Notes'
import { ViewPastes } from './components/ViewPastes'

import { Home } from './components/Home'
import { Toaster } from 'react-hot-toast';
import Archieve from './components/Archieve';
import Important from './components/Important';
import Bin from './components/Bin';
import { LoginSignup } from './components/LoginSignup/LoginSignup';
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user)
  if (!user) {
    return <Navigate to="/login" />
  }
  return children
}
const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute>

      <div>
        <Navbar />
        <Home />
      </div>
    </ProtectedRoute>,
  },

  {
    path: "/notes",
    element: <ProtectedRoute><div>
      <Navbar />
      <Pastes />
    </div></ProtectedRoute>,
  },
  {
    path: "/Archieve",
    element: <ProtectedRoute><div>
      <Navbar />
      <Archieve />
    </div></ProtectedRoute>,
  },
  {
    path: "/important",
    element: <ProtectedRoute><div>
      <Navbar />
      <Important />
    </div></ProtectedRoute>,
  },
  {
    path: "/Bin",
    element: <ProtectedRoute><div>
      <Navbar />
      <Bin />
    </div></ProtectedRoute>,
  },
  {
    path: "/notes/:id",
    element: <ProtectedRoute><div>
      <Navbar />
      <ViewPastes />
    </div></ProtectedRoute>,
  },
  {
    path: "/login",
    element: <div>
      <LoginSignup />
    </div>,
  },

]);

const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </div>
  )
}

export default App
