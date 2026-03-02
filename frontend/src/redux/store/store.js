import { configureStore } from '@reduxjs/toolkit'
import pasteReducer from '../features/noteSlice'
import authReducer from '../features/authSlice'
export const store = configureStore({
  reducer: {
    paste: pasteReducer,
    auth: authReducer,
  },
})