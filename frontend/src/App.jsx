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

import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { fetchMeThunk } from './redux/features/authSlice'
import { fetchNotesThunk } from './redux/features/noteSlice'
import OtpVerification from "./components/auth/OtpVerification";
import { LoginSignup } from './components/auth/LoginSignup';
import {ResetPasswordForm} from './components/auth/ResetPasswordForm'
import {ForgotPasswordForm} from './components/auth/ForgotPasswordForm'

const ProtectedRoute = ({ children }) => {
  const { user, initialized } = useSelector((state) => state.auth)
  if (!initialized) {
    return <div>Loading...</div>
  }
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
  {
    path: "/verify",
    element: <div>
      <OtpVerification />
    </div>,
  },

  {
    path: "/reset-password",
    element: <div>
      <ResetPasswordForm />
    </div>,
  },
  {
    path: "/forgot-password",
    element: <div>
      <ForgotPasswordForm />
    </div>,
  },

]);

const App = () => {
  const dispatch = useDispatch()
  const { user, initialized } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(fetchMeThunk())
  }, [dispatch])


  useEffect(() => {
    if (initialized && user) {
      dispatch(fetchNotesThunk())
    }
  }, [dispatch, initialized, user])

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
