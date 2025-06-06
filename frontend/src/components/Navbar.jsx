import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { logout } from '../store/authSlice'
import LanguageSelector from './LanguageSelector'

const Navbar = () => {
  const { t } = useTranslation()
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <nav className="bg-gray-900 text-white shadow-lg border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
            <img src="/assets/logo.png" alt="Drive Test Logo" className="h-8 w-auto" />
            <span>DTTP</span>
          </Link>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="hover:text-gray-300 transition-colors">
                  {t('common.dashboard')}
                </Link>
                <Link to="/training" className="hover:text-gray-300 transition-colors">
                  {t('common.training')}
                </Link>
                <Link to="/exam" className="hover:text-gray-300 transition-colors">
                  {t('common.exam')}
                </Link>
                <Link to="/questions" className="hover:text-gray-300 transition-colors">
                  {t('common.questions')}
                </Link>
                <Link to="/history" className="hover:text-gray-300 transition-colors">
                  {t('common.history')}
                </Link>
                {user?.is_admin && (
                  <Link to="/admin" className="hover:text-yellow-300 text-yellow-400 transition-colors">
                    {t('common.admin')}
                  </Link>
                )}
                <span className="text-blue-200">
                  {t('dashboard.welcome')}, {user?.username || 'User'}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded"
                >
                  {t('common.logout')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200">
                  {t('common.login')}
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded"
                >
                  {t('common.register')}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
