import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice'
import { authAPI } from '../services/api'

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading, error } = useSelector((state) => state.auth)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(loginStart())
    
    try {
      const response = await authAPI.login(formData)
      const { access_token } = response.data
      
      // Set token in localStorage first
      localStorage.setItem('token', access_token)
      
      // Get user data with the new token
      const userResponse = await authAPI.getMe()
      
      dispatch(loginSuccess({
        token: access_token,
        user: userResponse.data
      }))
      
      navigate('/dashboard')
    } catch (error) {
      dispatch(loginFailure(error.response?.data?.detail || 'Login failed'))
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md border border-gray-700">
        <h2 className="text-2xl font-bold text-center mb-8 text-white">Login</h2>
        
        {error && (
          <div className="bg-red-900 border border-red-600 text-red-300 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p className="text-center mt-4 text-gray-300">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-400 hover:text-blue-300">
            Register here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
