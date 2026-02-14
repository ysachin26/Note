import React from 'react'
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

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>
      <Navbar />
      <Home />
    </div>,
  },

  {
    path: "/notes",
    element: <div>
      <Navbar />
      <Pastes />
    </div>,
  },
  {
    path: "/Archieve",
    element: <div>
      <Navbar />
      <Archieve />
    </div>,
  },
  {
    path: "/important",
    element: <div>
      <Navbar />
      <Important />
    </div>,
  },
  {
    path: "/Bin",
    element: <div>
      <Navbar />
      <Bin />
    </div>,
  },
  {
    path: "/notes/:id",
    element: <div>
      <Navbar />
      <ViewPastes />
    </div>,
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
