import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { loginUser, registerUser } from '../../api/authApi'


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

 
const authSlice = createSlice({
    name: 'auth',
    initialState: { user: null, loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginThunk.pending, (state) => {
                state.loading = true
            })
            .addCase(loginThunk.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
                   .addCase(registerThunk.pending, (state) => {
                state.loading = true
            })
            .addCase(registerThunk.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload
            })
            .addCase(registerThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
    }
})

export default authSlice.reducer