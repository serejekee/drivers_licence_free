import React, { useState, useEffect } from 'react'
import { adminAPI } from '../services/api'

const AdminPanel = () => {
  const [users, setUsers] = useState([])
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('users')
  const [csvFile, setCsvFile] = useState(null)
  const [uploadStatus, setUploadStatus] = useState('')
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [newQuestion, setNewQuestion] = useState({
    question_text: '',
    answer_1: '',
    answer_2: '',
    answer_3: '',
    answer_4: '',
    right_answers: '',
    photo: ''
  })
  const [showAddForm, setShowAddForm] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [questionsPerPage, setQuestionsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalQuestions, setTotalQuestions] = useState(0)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (activeTab === 'questions') {
      fetchQuestions()
    }
  }, [currentPage, questionsPerPage, activeTab])

  const fetchData = async () => {
    try {
      const usersResponse = await adminAPI.getUsers()
      setUsers(usersResponse.data)
      if (activeTab === 'questions') {
        await fetchQuestions()
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchQuestions = async () => {
    try {
      const questionsResponse = await adminAPI.getQuestions(currentPage, questionsPerPage)
      setQuestions(questionsResponse.data.questions)
      setTotalPages(questionsResponse.data.totalPages)
      setTotalQuestions(questionsResponse.data.totalQuestions)
    } catch (error) {
      console.error('Error fetching questions:', error)
    }
  }

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminAPI.deleteUser(userId)
        setUsers(users.filter(user => user.id !== userId))
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    }
  }

  const deleteQuestion = async (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await adminAPI.deleteQuestion(questionId)
        // Refresh the current page
        await fetchQuestions()
      } catch (error) {
        console.error('Error deleting question:', error)
      }
    }
  }

  const deleteAllQuestions = async () => {
    if (window.confirm('Are you sure you want to delete ALL questions? This action cannot be undone!')) {
      try {
        const response = await adminAPI.deleteAllQuestions()
        setQuestions([])
        alert(`Successfully deleted ${response.data.deleted_count} questions`)
      } catch (error) {
        console.error('Error deleting all questions:', error)
        alert('Failed to delete all questions')
      }
    }
  }

  const handleEditQuestion = (question) => {
    setEditingQuestion({ ...question })
  }

  const saveEditedQuestion = async () => {
    try {
      await adminAPI.updateQuestion(editingQuestion.id, editingQuestion)
      setQuestions(questions.map(q => q.id === editingQuestion.id ? editingQuestion : q))
      setEditingQuestion(null)
    } catch (error) {
      console.error('Error updating question:', error)
    }
  }

  const addNewQuestion = async () => {
    try {
      const response = await adminAPI.createQuestion(newQuestion)
      setQuestions([...questions, response.data])
      setNewQuestion({
        question_text: '',
        answer_1: '',
        answer_2: '',
        answer_3: '',
        answer_4: '',
        right_answers: '',
        photo: ''
      })
      setShowAddForm(false)
    } catch (error) {
      console.error('Error adding question:', error)
    }
  }

  const uploadCsv = async () => {
    if (!csvFile) return alert("Please select a CSV file to upload.")
    const formData = new FormData()
    formData.append("file", csvFile)
    try {
      const response = await adminAPI.importQuestions(formData)
      setUploadStatus(response.data.message)
      if (response.data.errors && response.data.errors.length > 0) {
        alert("Some rows failed to import: " + response.data.errors.join(', '))
      }
      fetchData()
      setCsvFile(null)
    } catch (error) {
      console.error("Error uploading CSV:", error)
      setUploadStatus("Failed to upload CSV")
    }
  }

  const uploadImage = async () => {
    if (!imageFile) return
    
    setUploadingImage(true)
    const formData = new FormData()
    formData.append("file", imageFile)
    
    try {
      const response = await adminAPI.uploadImage(formData)
      return response.data.path
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Failed to upload image")
      return null
    } finally {
      setUploadingImage(false)
    }
  }

  const handleImageUpload = async (e, isEdit = false) => {
    const file = e.target.files[0]
    if (!file) return
    
    setImageFile(file)
    const imagePath = await uploadImage()
    
    if (imagePath) {
      if (isEdit) {
        setEditingQuestion({...editingQuestion, photo: imagePath})
      } else {
        setNewQuestion({...newQuestion, photo: imagePath})
      }
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-6">Admin Panel</h1>

      <div className="mb-6">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'users'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'questions'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Questions
          </button>
        </nav>
      </div>

      {activeTab === 'users' && (
        <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Users Management</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.is_admin ? 'Admin' : 'User'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.is_active ? 'Active' : 'Inactive'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'questions' && (
        <div>
          {/* CSV Upload Section */}
          <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Upload Questions from CSV</h2>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setCsvFile(e.target.files[0])}
                className="block w-full text-sm text-gray-300
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-600 file:text-white
                  hover:file:bg-blue-700"
              />
              <button
                onClick={uploadCsv}
                disabled={!csvFile}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-600"
              >
                Upload
              </button>
            </div>
            {uploadStatus && (
              <p className="mt-2 text-sm text-green-400">{uploadStatus}</p>
            )}
            <p className="mt-2 text-xs text-gray-400">
              CSV format: question_text, answer_1, answer_2, answer_3, answer_4, right_answers, photo
            </p>
          </div>

          {/* Add New Question Button and Delete All Questions Button */}
          <div className="mb-6 flex space-x-4">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              {showAddForm ? 'Cancel' : 'Add New Question'}
            </button>
            <button
              onClick={deleteAllQuestions}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete All Questions
            </button>
          </div>

          {/* Add New Question Form */}
          {showAddForm && (
            <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Add New Question</h3>
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  placeholder="Question Text"
                  value={newQuestion.question_text}
                  onChange={(e) => setNewQuestion({...newQuestion, question_text: e.target.value})}
                  className="w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600"
                />
                <input
                  type="text"
                  placeholder="Answer 1"
                  value={newQuestion.answer_1}
                  onChange={(e) => setNewQuestion({...newQuestion, answer_1: e.target.value})}
                  className="w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600"
                />
                <input
                  type="text"
                  placeholder="Answer 2"
                  value={newQuestion.answer_2}
                  onChange={(e) => setNewQuestion({...newQuestion, answer_2: e.target.value})}
                  className="w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600"
                />
                <input
                  type="text"
                  placeholder="Answer 3"
                  value={newQuestion.answer_3}
                  onChange={(e) => setNewQuestion({...newQuestion, answer_3: e.target.value})}
                  className="w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600"
                />
                <input
                  type="text"
                  placeholder="Answer 4"
                  value={newQuestion.answer_4}
                  onChange={(e) => setNewQuestion({...newQuestion, answer_4: e.target.value})}
                  className="w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600"
                />
                <input
                  type="text"
                  placeholder="Right Answers (e.g., 1,3 or A,C)"
                  value={newQuestion.right_answers}
                  onChange={(e) => setNewQuestion({...newQuestion, right_answers: e.target.value})}
                  className="w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600"
                />
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Photo URL (optional)"
                    value={newQuestion.photo}
                    onChange={(e) => setNewQuestion({...newQuestion, photo: e.target.value})}
                    className="w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600"
                  />
                  <div className="text-gray-400 text-sm">Or upload image:</div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, false)}
                    disabled={uploadingImage}
                    className="block w-full text-sm text-gray-300
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-green-600 file:text-white
                      hover:file:bg-green-700 disabled:opacity-50"
                  />
                  {uploadingImage && <div className="text-blue-400 text-sm">Uploading image...</div>}
                  {newQuestion.photo && (
                    <div className="mt-2">
                      <img src={`/images/questions/${newQuestion.photo}`} alt="Preview" className="max-w-xs max-h-32 rounded" />
                    </div>
                  )}
                </div>
                <button
                  onClick={addNewQuestion}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Question
                </button>
              </div>
            </div>
          )}

          {/* Pagination Controls (Top) */}
          <div className="bg-gray-800 rounded-lg shadow-md p-4 mb-4">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-white">
                <span>Total questions: {totalQuestions} | </span>
                <span>Page {currentPage} of {totalPages}</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <label className="text-white text-sm">Questions per page:</label>
                  <select 
                    value={questionsPerPage} 
                    onChange={(e) => {
                      setQuestionsPerPage(Number(e.target.value))
                      setCurrentPage(1)
                    }}
                    className="bg-gray-700 text-white border border-gray-600 rounded px-2 py-1"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <span className="text-white px-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Questions List */}
          <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">Questions Management</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Question
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Answers
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Correct
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {questions.map((question) => (
                    <tr key={question.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {question.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300 max-w-xs">
                        <div className="truncate">{question.question_text}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        <div className="text-xs">
                          <div>1: {question.answer_1}</div>
                          <div>2: {question.answer_2}</div>
                          <div>3: {question.answer_3}</div>
                          <div>4: {question.answer_4}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {question.right_answers}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {question.photo ? (
                          <img src={`/images/questions/${question.photo}`} alt="Question" className="w-16 h-16 object-cover rounded" />
                        ) : (
                          <span className="text-gray-500">No image</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEditQuestion(question)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteQuestion(question.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls (Bottom) */}
          <div className="bg-gray-800 rounded-lg shadow-md p-4 mt-4">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-white">
                Showing {((currentPage - 1) * questionsPerPage) + 1} to {Math.min(currentPage * questionsPerPage, totalQuestions)} of {totalQuestions} questions
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  First
                </button>
                
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <span className="text-white px-3">
                  Page {currentPage} of {totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  Next
                </button>
                
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  Last
                </button>
              </div>
            </div>
          </div>

          {/* Edit Question Modal */}
          {editingQuestion && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg w-full max-w-2xl max-h-screen overflow-y-auto">
                <h3 className="text-lg font-semibold text-white mb-4">Edit Question</h3>
                <div className="grid grid-cols-1 gap-4">
                  <textarea
                    placeholder="Question Text"
                    value={editingQuestion.question_text}
                    onChange={(e) => setEditingQuestion({...editingQuestion, question_text: e.target.value})}
                    className="w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600 h-20"
                  />
                  <input
                    type="text"
                    placeholder="Answer 1"
                    value={editingQuestion.answer_1}
                    onChange={(e) => setEditingQuestion({...editingQuestion, answer_1: e.target.value})}
                    className="w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600"
                  />
                  <input
                    type="text"
                    placeholder="Answer 2"
                    value={editingQuestion.answer_2}
                    onChange={(e) => setEditingQuestion({...editingQuestion, answer_2: e.target.value})}
                    className="w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600"
                  />
                  <input
                    type="text"
                    placeholder="Answer 3"
                    value={editingQuestion.answer_3}
                    onChange={(e) => setEditingQuestion({...editingQuestion, answer_3: e.target.value})}
                    className="w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600"
                  />
                  <input
                    type="text"
                    placeholder="Answer 4"
                    value={editingQuestion.answer_4}
                    onChange={(e) => setEditingQuestion({...editingQuestion, answer_4: e.target.value})}
                    className="w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600"
                  />
                  <input
                    type="text"
                    placeholder="Right Answers"
                    value={editingQuestion.right_answers}
                    onChange={(e) => setEditingQuestion({...editingQuestion, right_answers: e.target.value})}
                    className="w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600"
                  />
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Photo URL"
                      value={editingQuestion.photo || ''}
                      onChange={(e) => setEditingQuestion({...editingQuestion, photo: e.target.value})}
                      className="w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600"
                    />
                    <div className="text-gray-400 text-sm">Or upload image:</div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, true)}
                      disabled={uploadingImage}
                      className="block w-full text-sm text-gray-300
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-green-600 file:text-white
                        hover:file:bg-green-700 disabled:opacity-50"
                    />
                    {uploadingImage && <div className="text-blue-400 text-sm">Uploading image...</div>}
                    {editingQuestion.photo && (
                      <div className="mt-2">
                        <img src={`/images/questions/${editingQuestion.photo}`} alt="Preview" className="max-w-xs max-h-32 rounded" />
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={saveEditedQuestion}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditingQuestion(null)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminPanel
