import React from 'react'

const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-gray-800 rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-white mb-8">Terms of Service</h1>
        
        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing and using this driving license exam preparation application, 
              you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to these terms, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Service Description</h2>
            <p>
              Our application provides educational materials and practice tests for driving license 
              exam preparation. The service includes access to question banks, practice exams, 
              training modes, and progress tracking features.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. User Registration</h2>
            <p className="mb-3">To use our services, you must:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>Be at least 13 years old or have parental consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. User Conduct</h2>
            <p className="mb-3">You agree not to:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Use the service for any illegal or unauthorized purpose</li>
              <li>Attempt to gain unauthorized access to any part of the service</li>
              <li>Share your account credentials with others</li>
              <li>Upload malicious code or attempt to disrupt the service</li>
              <li>Copy, reproduce, or distribute content without permission</li>
              <li>Use automated tools to access the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Intellectual Property</h2>
            <p>
              All content, including but not limited to questions, answers, explanations, 
              images, and software, is the property of the service provider or licensed content creators. 
              You may not reproduce, distribute, or create derivative works without express written permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Educational Purpose Disclaimer</h2>
            <p>
              This application is designed for educational purposes only. While we strive to provide 
              accurate and up-to-date information, we do not guarantee that the content reflects 
              the most current driving laws or exam requirements in your jurisdiction. 
              Always consult official sources and authorized driving instructors.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Service Availability</h2>
            <p>
              We strive to maintain service availability but do not guarantee uninterrupted access. 
              The service may be temporarily unavailable due to maintenance, updates, 
              or circumstances beyond our control.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, we shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages resulting from your use 
              of the service, including but not limited to loss of data, revenue, or profits.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Account Termination</h2>
            <p className="mb-3">We reserve the right to terminate or suspend accounts for:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Violation of these terms of service</li>
              <li>Fraudulent or suspicious activity</li>
              <li>Failure to comply with applicable laws</li>
              <li>Extended periods of inactivity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Data and Privacy</h2>
            <p>
              Your privacy is important to us. Please review our Privacy Policy 
              to understand how we collect, use, and protect your personal information. 
              By using this service, you consent to our data practices as described in the Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">11. Updates and Modifications</h2>
            <p>
              We reserve the right to modify these terms at any time. 
              Significant changes will be communicated to users via email or app notifications. 
              Continued use of the service after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">12. Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with applicable laws. 
              Any disputes arising from these terms or your use of the service will be resolved 
              through appropriate legal channels.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">13. Contact Information</h2>
            <p>
              For questions about these Terms of Service, please contact us through 
              the feedback form in the application or by email: legal@driving-exam-app.com
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

export default TermsOfService
