import type { PlasmoCSConfig } from "plasmo"
import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"

import "~style.css"

// Match Salesforce Lightning pages
export const config: PlasmoCSConfig = {
  matches: [
    "https://*.lightning.force.com/*",
    "https://*.my.salesforce.com/*",
    "https://*.salesforce.com/*"
  ],
  all_frames: false
}

const SalesforceButton = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    // Check if we're on a Salesforce page with forms
    const checkForForms = () => {
      const forms = document.querySelectorAll('form, [data-aura-class], [data-component-id]')
      const isLightning = window.location.hostname.includes('lightning.force.com') ||
                          window.location.hostname.includes('salesforce.com')
      
      if (forms.length > 0 && isLightning) {
        setIsVisible(true)
      }
    }

    // Initial check
    checkForForms()

    // Watch for DOM changes (Salesforce Lightning uses dynamic rendering)
    const observer = new MutationObserver(checkForForms)
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    return () => observer.disconnect()
  }, [])

  const handleClick = async () => {
    setIsProcessing(true)
    
    // Placeholder action - this is where you'd add actual functionality
    console.log('Nimbus button clicked on Salesforce page')
    console.log('Current URL:', window.location.href)
    
    // Simulate some processing
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    alert('Nimbus placeholder action completed! This is where you would add custom Salesforce functionality.')
    
    setIsProcessing(false)
  }

  if (!isVisible) return null

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 10000,
      }}>
      <button
        onClick={handleClick}
        disabled={isProcessing}
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl h-14 w-14 group"
        title="Nimbus Action">
        {isProcessing ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 group-hover:scale-110 transition-transform">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        )}
      </button>
    </div>
  )
}

export default SalesforceButton
