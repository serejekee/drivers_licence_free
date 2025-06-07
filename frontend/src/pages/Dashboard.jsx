import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { examAPI } from '../services/api'

const Dashboard = () => {
  const { t } = useTranslation()
  const { user, loading: authLoading } = useSelector((state) => state.auth)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      // Don't fetch stats if user is still loading
      if (authLoading || !user) {
        return
      }
      
      try {
        const response = await examAPI.getExamStats()
        setStats(response.data)
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [authLoading, user])
  const total = stats?.total_modules ?? 0

  // Show loading if auth is still loading or user data is not available
  if (authLoading || !user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="text-white text-xl">{t('common.loading')}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">{t('common.dashboard')}</h1>
        <p className="text-xl text-gray-300">
          {t('dashboard.welcome')}, {user?.first_name || user?.username}!
        </p>
      </div>

      <div className="flex flex-col lg:flex-row justify-center items-start gap-8 mb-12 w-full">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 max-w-xs w-full">
          <h2 className="text-2xl font-semibold mb-4 text-white">👤 {t('profile.personalInfo')}</h2>
          <div className="space-y-3">
            <p className="text-gray-300"><span className="font-medium text-white">{t('auth.username')}:</span> {user?.username}</p>
            <p className="text-gray-300"><span className="font-medium text-white">{t('auth.email')}:</span> {user?.email}</p>
            <p className="text-gray-300">
              <span className="font-medium text-white">{t('auth.firstName')} {t('auth.lastName')}:</span> {user?.first_name} {user?.last_name}
            </p>
            <p className="text-gray-300">
              <span className="font-medium text-white">Role:</span> {user?.is_admin ? 'Administrator' : 'User'}
            </p>
          </div>
          <div className="mt-4 flex justify-center">
            <Link
              to="/profile"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {t('common.edit')} {t('common.profile')}
            </Link>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 max-w-xs w-full flex flex-col justify-between">
          <div>
            <h3 className="text-white text-lg mb-4">{t('dashboard.learningProgress')}</h3>

            {/* Прогресс-бар */}
            <div className="relative w-full bg-gray-500 rounded-full h-4">
              <div
                className="absolute left-0 top-0 h-4 bg-green-500 rounded-full transition-all duration-500 ease-in-out"
                style={{
                  width:
                    stats && stats.total_exams > 0
                      ? `max(${Math.round((stats.passed_exams / stats.total_exams) * 100)}%, 4px)`
                      : '0px',
                }}
              ></div>
            </div>

            {/* Текст прогресса */}
            <p className="text-sm text-gray-300 mt-2 text-center">
              { typeof stats?.total_exams === 'number'
                ? t('dashboard.modulesCompleted', {
                    total: stats.total_exams
                  })
                : t('dashboard.modulesCompleted', {total: 0 })}
            </p>
          </div>

          {/* Медаль под прогрессом */}
          <div className="mt-8 flex justify-center">
            {stats?.total_exams >= 100 && (
              <img
                src="/assets/gold.svg"
                alt="Gold Master"
                title="Gold Master"
                className="h-40 w-40"
              />
            )}
            {stats?.total_exams >= 10 && stats?.total_exams < 100 && (
              <img
                src="/assets/silver.svg"
                alt="Silver Achiever"
                title="Silver Achiever"
                className="h-40 w-40"
              />
            )}
            {stats?.total_exams >= 1 && stats?.total_exams < 10 && (
              <img
                src="/assets/bronze.svg"
                alt="Bronze Starter"
                title="Bronze Starter"
                className="h-40 w-40"
              />
            )}
          </div>

        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 max-w-xs w-full">
          <h2 className="text-2xl font-semibold mb-4 text-white">🚀 {t('dashboard.quickActions')}</h2>
          <div className="space-y-4">
            <Link
              to="/training"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-center font-medium transition-colors"
            >
              {t('dashboard.practiceMode')}
            </Link>
            <Link
              to="/exam"
              className="block w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg text-center font-medium transition-colors"
            >
              {t('dashboard.startExam')}
            </Link>
            <Link
              to="/questions"
              className="block w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg text-center font-medium transition-colors"
            >
              {t('common.questions')}
            </Link>
            <Link
              to="/history"
              className="block w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg text-center font-medium transition-colors"
            >
              {t('common.history')}
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
        <h2 className="text-2xl font-semibold mb-4 text-white">📊 {t('dashboard.examStats')}</h2>
        {loading ? (
          <div className="text-center text-gray-300">{t('common.loading')}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {stats ? stats.total_training_sessions : 0}
                </div>
                <div className="text-gray-300">{t('dashboard.practiceMode')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {stats ? stats.passed_exams : 0}
                </div>
                <div className="text-gray-300">{t('exam.passed')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">
                  {stats && stats.total_exams > 0 ? `${Math.round((stats.passed_exams / stats.total_exams) * 100)}%` : '0%'}
                </div>
                <div className="text-gray-300">{t('dashboard.successRate')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {stats ? Math.round(stats.average_score) : 0}%
                </div>
                <div className="text-gray-300">{t('dashboard.averageScore')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">
                  {stats ? Math.round(stats.best_score) : 0}%
                </div>
                <div className="text-gray-300">{t('dashboard.bestScore')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400 mb-2">
                  {stats ? stats.total_exams : 0}
                </div>
                <div className="text-gray-300">{t('dashboard.totalExams')}</div>
              </div>
            </div>
          </>
        )}
      </div>

    </div>
  )
}

export default Dashboard

