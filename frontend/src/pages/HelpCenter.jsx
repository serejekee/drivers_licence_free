import React, { useState } from 'react'

const HelpCenter = () => {
  const [openFAQ, setOpenFAQ] = useState(null)

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  const faqData = [
    {
      question: "How do I create an account?",
      answer: "Click on the 'Register' button in the top navigation menu. Fill in your username, email address, and create a secure password. You'll receive a confirmation and can start using the app immediately."
    },
    {
      question: "What's the difference between Training and Exam modes?",
      answer: "Training mode allows you to practice with random questions at your own pace, with immediate feedback after each answer. Exam mode simulates the real driving test with a time limit and provides results only at the end."
    },
    {
      question: "How many questions are in the question bank?",
      answer: "Our application contains hundreds of official driving test questions covering all topics including traffic laws, road signs, safety regulations, and practical driving situations."
    },
    {
      question: "Can I track my progress?",
      answer: "Yes! The Dashboard shows your exam history, success rates, and performance statistics. You can see which areas you need to improve and monitor your progress over time."
    },
    {
      question: "Are the questions updated regularly?",
      answer: "We regularly update our question bank to reflect current driving laws and regulations. However, always verify information with your local DMV or driving authority for the most current requirements."
    },
    {
      question: "How do I reset my password?",
      answer: "Currently, password reset is handled by administrators. Please contact support through the feedback form with your username and email address for assistance."
    },
    {
      question: "Can I use this app on mobile devices?",
      answer: "Yes! Our application is responsive and works on desktop computers, tablets, and mobile phones. Simply access it through your web browser."
    },
    {
      question: "Is my personal data secure?",
      answer: "Absolutely. We take data security seriously and employ encryption and secure practices to protect your information. Please read our Privacy Policy for detailed information about data handling."
    }
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-gray-800 rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-white mb-8">Help Center</h1>
        
        {/* Quick Start Guide */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">Quick Start Guide</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-700 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-3">🚀 Getting Started</h3>
              <ol className="text-gray-300 space-y-2">
                <li>1. Create your account</li>
                <li>2. Explore the Dashboard</li>
                <li>3. Start with Training mode</li>
                <li>4. Take practice exams</li>
                <li>5. Review your results</li>
              </ol>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-3">📚 Study Tips</h3>
              <ul className="text-gray-300 space-y-2">
                <li>• Practice regularly for best results</li>
                <li>• Focus on areas with low scores</li>
                <li>• Review explanations carefully</li>
                <li>• Take breaks between study sessions</li>
                <li>• Simulate exam conditions when ready</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Features Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">Features Overview</h2>
          <div className="space-y-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">🎯 Training Mode</h3>
              <p className="text-gray-300">
                Practice with random questions, get immediate feedback, and learn at your own pace. 
                Perfect for building knowledge and confidence.
              </p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">📝 Exam Mode</h3>
              <p className="text-gray-300">
                Take timed practice exams that simulate real driving test conditions. 
                Get comprehensive results and performance analysis.
              </p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">📊 Progress Tracking</h3>
              <p className="text-gray-300">
                Monitor your improvement with detailed statistics, exam history, 
                and performance analytics to identify areas for improvement.
              </p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">📖 Question Bank</h3>
              <p className="text-gray-300">
                Browse through all available questions with answers and explanations. 
                Study specific topics or review challenging questions.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-gray-700 rounded-lg">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-4 text-left flex justify-between items-center hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <span className="text-white font-medium">{faq.question}</span>
                  <span className="text-gray-400 text-xl">
                    {openFAQ === index ? '−' : '+'}
                  </span>
                </button>
                {openFAQ === index && (
                  <div className="px-4 pb-4">
                    <p className="text-gray-300">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact Support */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Need More Help?</h2>
          <div className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">Contact Support</h3>
            <p className="text-gray-300 mb-4">
              Can't find the answer you're looking for? Our support team is here to help!
            </p>
            <div className="space-y-2 text-gray-300">
              <p>📧 Email: support@driving-exam-app.com</p>
              <p>🕒 Response time: Usually within 24 hours</p>
              <p>📝 Include your username and describe your issue clearly</p>
            </div>
          </div>
        </section>

        {/* System Requirements */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-6">System Requirements</h2>
          <div className="bg-gray-700 p-6 rounded-lg">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Recommended Browsers</h3>
                <ul className="text-gray-300 space-y-1">
                  <li>• Chrome 90+</li>
                  <li>• Firefox 88+</li>
                  <li>• Safari 14+</li>
                  <li>• Edge 90+</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Requirements</h3>
                <ul className="text-gray-300 space-y-1">
                  <li>• Stable internet connection</li>
                  <li>• JavaScript enabled</li>
                  <li>• Cookies enabled</li>
                  <li>• Screen resolution: 1024x768+</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default HelpCenter
