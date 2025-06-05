import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: !!localStorage.getItem('token'), // Set loading to true if token exists
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.loading = false
      state.error = null
    },
    setToken: (state, action) => {
      state.token = action.payload
      state.isAuthenticated = true
      localStorage.setItem('token', action.payload)
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
      state.loading = false
    },
    clearError: (state) => {
      state.error = null
    },
    loginStart: (state) => {
      state.loading = true
      state.error = null
    },
    loginSuccess: (state, action) => {
      state.loading = false
      state.isAuthenticated = true
      state.user = action.payload.user
      state.token = action.payload.token
      state.error = null
      // Token is already set in localStorage by Login component
    },
    loginFailure: (state, action) => {
      state.loading = false
      state.isAuthenticated = false
      state.user = null
      state.token = null
      state.error = action.payload
      localStorage.removeItem('token')
    },
  },
})

export const { setUser, setToken, logout, setLoading, setError, clearError, loginStart, loginSuccess, loginFailure } = authSlice.actions
export default authSlice.reducer
