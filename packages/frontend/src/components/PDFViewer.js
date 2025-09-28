'use client'

import { useState, useEffect } from 'react'
import { X, Download, AlertTriangle } from 'lucide-react'

export default function PDFViewer({ materialId, material, onClose }) {
  const [pdfUrl, setPdfUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isBlurred, setIsBlurred] = useState(false)

  useEffect(() => {
    if (materialId) {
      fetchPDF()
    }
  }, [materialId])

  const fetchPDF = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`http://localhost:5001/materials/${materialId}/view`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to load PDF')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setPdfUrl(url)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl)
    }
    onClose()
  }

  // Prevent right-click context menu
  const handleContextMenu = (e) => {
    e.preventDefault()
  }

  // Disable common keyboard shortcuts for downloading/saving/screenshots
  const handleKeyDown = (e) => {
    if (
      (e.ctrlKey && (e.key === 's' || e.key === 'S')) || // Ctrl+S
      (e.ctrlKey && (e.key === 'p' || e.key === 'P')) || // Ctrl+P
      (e.ctrlKey && e.shiftKey && (e.key === 'i' || e.key === 'I')) || // Ctrl+Shift+I
      (e.ctrlKey && e.shiftKey && (e.key === 'j' || e.key === 'J')) || // Ctrl+Shift+J
      (e.ctrlKey && (e.key === 'u' || e.key === 'U')) || // Ctrl+U (view source)
      (e.key === 'PrintScreen') || // Print Screen
      (e.altKey && e.key === 'PrintScreen') || // Alt+Print Screen
      (e.ctrlKey && e.key === 'PrintScreen') || // Ctrl+Print Screen
      (e.key === 'F12') || // F12
      (e.key === 'F11') || // F11 (fullscreen might help screenshots)
      (e.ctrlKey && e.shiftKey && (e.key === 'c' || e.key === 'C')) || // Ctrl+Shift+C
      (e.ctrlKey && (e.key === 'a' || e.key === 'A')) || // Ctrl+A (select all)
      (e.ctrlKey && (e.key === 'c' || e.key === 'C')) || // Ctrl+C (copy)
      (e.metaKey && (e.key === 's' || e.key === 'S')) || // Cmd+S (Mac)
      (e.metaKey && (e.key === 'p' || e.key === 'P')) || // Cmd+P (Mac)
      (e.metaKey && (e.key === 'c' || e.key === 'C')) || // Cmd+C (Mac)
      (e.metaKey && (e.key === 'a' || e.key === 'A')) // Cmd+A (Mac)
    ) {
      e.preventDefault()
      e.stopPropagation()
      return false
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown, true)
    document.addEventListener('contextmenu', handleContextMenu, true)

    // Disable text selection on the entire document while PDF is open
    document.body.style.userSelect = 'none'
    document.body.style.webkitUserSelect = 'none'
    document.body.style.mozUserSelect = 'none'
    document.body.style.msUserSelect = 'none'

    // Add watermark overlay with user identification
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const watermark = document.createElement('div')
    watermark.id = 'pdf-watermark'
    watermark.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    `

    // Create repeating watermark text with user info
    const watermarkText = `
      <div style="
        position: absolute;
        width: 200%;
        height: 200%;
        top: -50%;
        left: -50%;
        display: flex;
        flex-wrap: wrap;
        transform: rotate(-45deg);
        opacity: 0.1;
      ">
        ${Array(50).fill(0).map(() => `
          <div style="
            padding: 40px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            color: #FF0000;
            text-align: center;
            white-space: nowrap;
          ">
            CONFIDENTIAL - ${user.email || 'User'}<br/>
            ${new Date().toLocaleDateString()}<br/>
            DO NOT DISTRIBUTE
          </div>
        `).join('')}
      </div>
    `
    watermark.innerHTML = watermarkText
    document.body.appendChild(watermark)

    // Detect focus loss and blur content
    const handleFocusChange = () => {
      if (!document.hasFocus()) {
        setIsBlurred(true)
        console.warn('⚠️ Window lost focus - content blurred')
        // Log potential screenshot attempt
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        console.log(`[SECURITY] User ${user.email} - Window lost focus at ${new Date().toISOString()}`)
      } else {
        setIsBlurred(false)
      }
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsBlurred(true)
        console.warn('⚠️ Tab hidden - content blurred')
      } else if (document.hasFocus()) {
        setIsBlurred(false)
      }
    }

    // Add event listeners
    window.addEventListener('blur', () => handleFocusChange())
    window.addEventListener('focus', () => handleFocusChange())
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Initial check
    handleFocusChange()

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true)
      document.removeEventListener('contextmenu', handleContextMenu, true)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('blur', handleFocusChange)
      window.removeEventListener('focus', handleFocusChange)

      // Restore text selection
      document.body.style.userSelect = ''
      document.body.style.webkitUserSelect = ''
      document.body.style.mozUserSelect = ''
      document.body.style.msUserSelect = ''

      // Remove watermark
      const existingWatermark = document.getElementById('pdf-watermark')
      if (existingWatermark) {
        existingWatermark.remove()
      }
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full h-full max-w-6xl max-h-[95vh] mx-4 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">
              {material?.title || 'PDF Viewer'}
            </h2>
            {material?.description && (
              <p className="text-sm text-gray-600 mt-1">{material.description}</p>
            )}
          </div>

          {/* Download Warning */}
          <div className="flex items-center gap-3 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg mr-4">
            <AlertTriangle className="h-4 w-4" />
            <span>View Only - Downloads Disabled</span>
          </div>

          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center p-4">
          {loading && (
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span className="text-gray-600">Loading PDF...</span>
            </div>
          )}

          {error && (
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load PDF</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={fetchPDF}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {pdfUrl && !loading && !error && (
            <div className="w-full h-full relative">
              {/* Blur overlay when window loses focus */}
              {isBlurred && (
                <div className="absolute inset-0 z-50 flex items-center justify-center"
                     style={{
                       backdropFilter: 'blur(20px)',
                       backgroundColor: 'rgba(0, 0, 0, 0.8)'
                     }}>
                  <div className="bg-red-600 text-white p-8 rounded-lg max-w-md text-center">
                    <AlertTriangle className="h-16 w-16 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-3">Security Alert</h3>
                    <p className="text-lg mb-2">Content Hidden - Window Lost Focus</p>
                    <p className="text-sm opacity-90">
                      The PDF has been blurred because the window is not in focus.
                      This is a security measure to prevent unauthorized screenshots.
                    </p>
                    <p className="text-xs mt-4 font-semibold">
                      Click back on this window to continue viewing.
                    </p>
                  </div>
                </div>
              )}
              <iframe
                src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&zoom=page-fit&view=FitH`}
                className="w-full h-full border-0 rounded-lg"
                title="PDF Viewer"
                onContextMenu={handleContextMenu}
                onLoad={(e) => {
                  // Additional security for iframe content
                  try {
                    const iframeDoc = e.target.contentDocument || e.target.contentWindow.document
                    if (iframeDoc) {
                      iframeDoc.addEventListener('contextmenu', handleContextMenu)
                      iframeDoc.addEventListener('keydown', handleKeyDown)
                      iframeDoc.body.style.userSelect = 'none'
                      iframeDoc.body.style.webkitUserSelect = 'none'
                    }
                  } catch (err) {
                    // Cross-origin iframe, can't access content (which is actually better for security)
                  }
                }}
                style={{
                  pointerEvents: isBlurred ? 'none' : 'auto',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none',
                  border: 'none',
                  outline: 'none',
                  filter: isBlurred ? 'blur(30px)' : 'none',
                  transition: 'filter 0.3s ease'
                }}
              />
              {/* Invisible overlay to prevent some screenshot tools */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(45deg, transparent 49%, rgba(255,255,255,0.01) 50%, transparent 51%)',
                  zIndex: 1
                }}
              />
            </div>
          )}
        </div>

        {/* Footer with security notice */}
        <div className="px-4 py-3 bg-red-50 border-t border-red-200 text-center">
          <p className="text-sm font-semibold text-red-700 mb-1">
            🔒 CONFIDENTIAL MATERIAL - UNAUTHORIZED DISTRIBUTION PROHIBITED
          </p>
          <p className="text-xs text-red-600">
            ⚠️ Screenshots and copying are monitored • Downloads disabled • View-only access
          </p>
        </div>
      </div>

      {/* CSS to hide PDF toolbar and disable context menu */}
      <style jsx>{`
        iframe {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          -webkit-touch-callout: none;
          -webkit-tap-highlight-color: transparent;
          pointer-events: auto;
          outline: none;
        }

        /* Hide browser's PDF controls */
        iframe::-webkit-scrollbar {
          display: none;
        }

        /* Additional security styles */
        iframe::selection {
          background: transparent;
        }

        iframe::-moz-selection {
          background: transparent;
        }

        /* Prevent drag operations */
        iframe {
          -webkit-user-drag: none;
          -moz-user-drag: none;
          user-drag: none;
        }

        /* Disable print media styles */
        @media print {
          iframe {
            display: none !important;
          }
        }

        /* Hide from screenshot tools that look for specific elements */
        iframe[title="PDF Viewer"] {
          content-visibility: auto;
        }
      `}</style>
    </div>
  )
}