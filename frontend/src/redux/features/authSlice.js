import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { loginUser, registerUser, getMe, logoutUser } from '../../api/authApi'


export const loginThunk = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
    try {
        const response = await loginUser(email, password)
        return response.data.user
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || 'Login failed')
    }
})

export const registerThunk = createAsyncThunk('auth/register', async ({
    name, email, password
}, { rejectWithValue }) => {
    try {
        const response = await registerUser(name, email, password)
        return response.data
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || 'Registration failed')
    }
})

export const fetchMeThunk = createAsyncThunk('auth/me', async () => {
    const response = await getMe()
    return response.data.user
})

export const logOutThunk = createAsyncThunk('auth/logout', async () => {
   await logoutUser()
    return null
})

 
const authSlice = createSlice({
    name: 'auth',
    initialState: { user: null, loading: false, error: null, initialized: false },
    reducers: {
        clearError: (state) => { state.error = null }
    },
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
                state.error = action.payload
                state.initialized = true
            })
                   .addCase(registerThunk.pending, (state) => {
                state.loading = true
            })
            .addCase(registerThunk.fulfilled, (state) => {
                state.loading = false
                state.user = null
                state.initialized = true
            })
            .addCase(registerThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
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
            .addCase(logOutThunk.rejected, (state) => {
                state.loading = false
                state.user = null
                state.initialized = true
            })
            .addCase(logOutThunk.pending, (state) => {
                state.loading = true
            })
            .addCase(logOutThunk.fulfilled, (state) => {
                state.loading = false
                state.user = null
                state.initialized = true
            })
    }
})

export const { clearError } = authSlice.actions
export default authSlice.reducer