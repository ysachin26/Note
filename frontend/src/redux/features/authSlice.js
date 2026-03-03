import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { loginUser, registerUser, getMe } from '../../api/authApi'


export const loginThunk = createAsyncThunk('auth/login', async ({ email, password }) => {
    const response = await loginUser(email, password)
    return response.data.user
})

export const registerThunk = createAsyncThunk('auth/register', async ({
    name, email, password
}) => {
    const response = await registerUser(name, email, password)
    return response.data.user
})

export const fetchMeThunk = createAsyncThunk('auth/me', async () => {
    const response = await getMe()
    return response.data.user
})

 
const authSlice = createSlice({
    name: 'auth',
    initialState: { user: null, loading: false, error: null, initialized: false },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginThunk.pending, (state) => {
                state.loading = true
            })
            .addCase(loginThunk.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload
                state.initialized = true
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
                state.initialized = true
            })
                   .addCase(registerThunk.pending, (state) => {
                state.loading = true
            })
            .addCase(registerThunk.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload
                state.initialized = true
            })
            .addCase(registerThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
                state.initialized = true
            })
            .addCase(fetchMeThunk.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchMeThunk.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload
                state.initialized = true
            })
            .addCase(fetchMeThunk.rejected, (state) => {
                state.loading = false
                state.user = null
                state.initialized = true
            })
    }
})

export default authSlice.reducer