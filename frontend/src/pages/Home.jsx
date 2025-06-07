import React from 'react'
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Home = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useSelector((state) => state.auth)

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-8">
          🚗 {t('common.drivingTestPlatform')}
        </h1>
        <p className="text-xl text-gray-300 mb-12">
          {t('common.masterWithPlatform')}
        </p>

        <div className="space-y-4">
          {isAuthenticated ? (
            <div>
              <Link
                to="/dashboard"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-medium inline-block"
              >
                {t('common.goToDashboard')}
              </Link>
            </div>
          ) : (
            <div className="space-x-4">
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-medium inline-block"
              >
                {t('common.login')}
              </Link>
              <Link
                to="/register"
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg text-lg font-medium inline-block"
              >
               {t('common.register')}
              </Link>
            </div>
          )}
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-white">📝 {t('common.practiceTests')}</h3>
            <p className="text-gray-300">{t('common.unlimitedPracticeTests')}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-white">🎯 {t('common.trainingMode')}</h3>
            <p className="text-gray-300">{t('common.detailedFeedback')}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-white">📊 {t('common.statisticsInDashboard')}</h3>
            <p className="text-gray-300">{t('common.managementSystem')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
