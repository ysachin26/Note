import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './redux/store/store.js'
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store = {store}>
      <GoogleOAuthProvider>
         <App />
</GoogleOAuthProvider>
    </Provider>
   
  </StrictMode>,
)
