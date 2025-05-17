import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Data Collection and Usage
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Our application is designed with privacy as a core principle. We do not collect or store any personal information. All searches are performed anonymously and are not logged or tracked.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Search Functionality
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We use Groq's AI-powered search to enhance your recipe search experience. All search queries are processed in real-time and are not stored. We do not use cookies or any form of tracking.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Third-Party Services
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Our application uses the following third-party services:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
              <li>TheMealDB API for recipe data</li>
              <li>Groq API for semantic search capabilities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Your Rights
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Since we do not collect any personal data, there is no data to request or delete. You can use our application with complete privacy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Contact
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              If you have any questions about our privacy practices, please contact us at privacy@globalrecipefinder.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
} 