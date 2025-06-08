import React, { useState, useEffect } from 'react'
import { examAPI } from '../services/api'

const ExamHistory = () => {
  const [history, setHistory] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await examAPI.getExamHistory()
        setHistory(response.data)
      } catch (error) {
        console.error('Error fetching exam history:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center text-white">Loading exam history...</div>
      </div>
    )
  }

  if (!history) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center text-white">Failed to load exam history</div>
      </div>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatTime = (seconds) => {
    if (!seconds) return 'N/A'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">История экзаменов</h1>

      {/* Статистика */}
      <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">📊 Общая статистика</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{history.stats.total_exams}</div>
            <div className="text-gray-300 text-sm">Всего экзаменов</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{history.stats.passed_exams}</div>
            <div className="text-gray-300 text-sm">Сдано</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">{history.stats.failed_exams}</div>
            <div className="text-gray-300 text-sm">Не сдано</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{Math.round(history.stats.average_score)}%</div>
            <div className="text-gray-300 text-sm">Средний балл</div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <div className="text-xl font-bold text-emerald-400">{Math.round(history.stats.best_score)}%</div>
            <div className="text-gray-300 text-sm">Лучший результат</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-orange-400">{Math.round(history.stats.worst_score)}%</div>
            <div className="text-gray-300 text-sm">Худший результат</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-cyan-400">{history.stats.total_training_sessions}</div>
            <div className="text-gray-300 text-sm">Тренировок</div>
          </div>
        </div>
      </div>

      {/* История результатов */}
      <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">🕒 История результатов</h2>
        </div>
        
        {history.results.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            У вас пока нет результатов экзаменов
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Дата
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Тип
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Результат
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Время
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Статус
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {history.results.map((result) => (
                  <tr key={result.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(result.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        result.exam_type === 'exam' 
                          ? 'bg-blue-900 text-blue-200' 
                          : 'bg-green-900 text-green-200'
                      }`}>
                        {result.exam_type === 'exam' ? 'Экзамен' : 'Тренировка'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div className="flex flex-col">
                        <span className={`font-bold ${
                          result.percentage >= 70 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {Math.round(result.percentage)}%
                        </span>
                        <span className="text-xs text-gray-500">
                          {result.correct_answers}/{result.total_questions}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatTime(result.time_taken)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {result.exam_type === 'exam' ? (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          result.passed 
                            ? 'bg-green-900 text-green-200' 
                            : 'bg-red-900 text-red-200'
                        }`}>
                          {result.passed ? '✅ Сдан' : '❌ Не сдан'}
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-700 text-gray-300">
                          Завершено
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default ExamHistory
