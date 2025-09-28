'use client'

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 border-2 border-red-200">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-700 mb-4">Critical Error</h2>
              <p className="text-gray-700 mb-4">A critical error occurred in the application.</p>
              <button
                onClick={() => reset()}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Reset Application
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}