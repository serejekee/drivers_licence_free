import React from 'react'

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-gray-800 rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-white mb-8">Privacy Policy</h1>
        
        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. General Information</h2>
            <p>
              This Privacy Policy governs the processing of personal data of users 
              of the educational application for driving license exam preparation. 
              We respect your privacy and are committed to protecting your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Data Collection</h2>
            <p className="mb-3">We collect the following personal data:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Username and email address upon registration</li>
              <li>Exam and training results for progress tracking</li>
              <li>Technical information about app usage</li>
              <li>IP address and browser data for security purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Purposes of Data Processing</h2>
            <p className="mb-3">Your personal data is used for:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Providing access to app features</li>
              <li>Tracking learning progress and exam results</li>
              <li>Improving the quality of educational materials</li>
              <li>Ensuring security and fraud prevention</li>
              <li>Communicating with users about service operations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Data Storage and Protection</h2>
            <p>
              We employ current technical and organizational measures to protect your data. 
              Personal data is stored encrypted on secure servers. 
              Only authorized personnel have access to the data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Data Sharing</h2>
            <p>
              We do not sell, trade, or transfer your personal information to third parties, 
              except where required by law or with your explicit consent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Your Rights</h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your personal data</li>
              <li>Restrict the processing of your personal data</li>
              <li>Withdraw consent for data processing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Cookies</h2>
            <p>
              We use cookies to enhance app performance and analyze usage. 
              You can disable cookies in your browser settings, but this may limit service functionality.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Changes to Policy</h2>
            <p>
              We reserve the right to change this Privacy Policy. 
              Substantial changes will be notified to users via email 
              or through app notifications.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Contact Information</h2>
            <p>
              For any questions regarding personal data processing, 
              contact us via the feedback form in the app 
              or by email: privacy@driving-exam-app.com
            </p>
          </section>

          <div className="mt-8 p-4 bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-400">
              Last updated: June 25, 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
