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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [formFields, setFormFields] = useState<string[]>([])
  const [hasForm, setHasForm] = useState(false)

  useEffect(() => {
    // Check if we're on a Salesforce page with forms
    const checkForForms = () => {
      // Look for more specific Salesforce form indicators
      const salesforceForms = document.querySelectorAll(`
        form,
        [data-aura-class*="form"],
        [data-aura-class*="Form"],
        .slds-form,
        .record-detail,
        .record-edit,
        [data-target-selection-name*="sfdc:RecordField"],
        .lightning-input,
        .lightning-textarea,
        .lightning-combobox,
        [class*="field"],
        [class*="Field"]
      `.replace(/\s+/g, ''))

      const isLightning = window.location.hostname.includes('lightning.force.com') ||
                          window.location.hostname.includes('salesforce.com')
      
      // Check if we're on a record page (create, edit, or view with editable fields)
      const isRecordPage = window.location.pathname.includes('/lightning/r/') ||
                           window.location.pathname.includes('/lightning/o/') ||
                           window.location.search.includes('mode=edit') ||
                           window.location.search.includes('mode=new')
      
      // Check if there are forms on the page and extract field information
      if (salesforceForms.length > 0 && isLightning && isRecordPage) {
        setHasForm(true)
        // Extract field labels from the form
        const fieldLabels: string[] = []
        
        // Look for various types of field labels and inputs
        const allFormElements = document.querySelectorAll(`
          label,
          .slds-form-element__label,
          .lightning-label,
          [data-label],
          input[placeholder],
          textarea[placeholder],
          .slds-form-element,
          .lightning-input,
          .lightning-textarea,
          .lightning-combobox,
          .lightning-dual-listbox
        `.replace(/\s+/g, ''))
        
        allFormElements.forEach(element => {
          let fieldName = ''
          
          // Try to get label text
          if (element.tagName === 'LABEL' || element.classList.contains('slds-form-element__label')) {
            fieldName = element.textContent?.trim() || ''
          }
          // Try to get placeholder text from inputs
          else if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
            fieldName = element.placeholder || element.getAttribute('aria-label') || ''
          }
          // Try to get field name from parent form element
          else {
            const label = element.querySelector('label, .slds-form-element__label')
            if (label) {
              fieldName = label.textContent?.trim() || ''
            } else {
              // Look for nearby labels
              const parentElement = element.closest('.slds-form-element, .lightning-input, .lightning-textarea')
              if (parentElement) {
                const nearbyLabel = parentElement.querySelector('label, .slds-form-element__label')
                if (nearbyLabel) {
                  fieldName = nearbyLabel.textContent?.trim() || ''
                }
              }
            }
          }
          
          // Clean up field name and add if valid
          fieldName = fieldName.replace(/\*/g, '').trim() // Remove required asterisks
          if (fieldName && fieldName.length > 0 && !fieldLabels.includes(fieldName)) {
            fieldLabels.push(fieldName)
          }
        })
        
        setFormFields(fieldLabels)
      } else {
        setHasForm(false)
        setFormFields([])
      }
    }

    // Initial form check
    checkForForms()

    // Watch for DOM changes (Salesforce Lightning uses dynamic rendering)
    const observer = new MutationObserver(checkForForms)
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  const handleClick = async () => {
    if (!hasForm) {
      alert('No forms detected on this page. Navigate to a Salesforce record page with forms to use Nimbus.')
      return
    }

    // Toggle drawer
    setIsDrawerOpen(!isDrawerOpen)
  }

  // Always render the button, but only show drawer functionality when authenticated

  return (
    <>
      {/* Floating Button */}
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
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            whiteSpace: "nowrap",
            borderRadius: "9999px",
            fontSize: "0.875rem",
            fontWeight: "500",
            transition: "all 0.2s",
            outline: "none",
            border: "none",
            cursor: isProcessing ? "not-allowed" : "pointer",
            opacity: isProcessing ? 0.5 : 1,
            background: isProcessing 
              ? "linear-gradient(to right, #3b82f6, #8b5cf6)" 
              : hasForm
                ? "linear-gradient(to right, #10b981, #059669)"  // Green when form detected
                : "linear-gradient(to right, #2563eb, #7c3aed)", // Blue default
            color: "white",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            height: "3.5rem",
            width: "3.5rem",
            pointerEvents: isProcessing ? "none" : "auto"
          }}
          onMouseEnter={(e) => {
            if (!isProcessing) {
              const bgColor = hasForm 
                ? "linear-gradient(to right, #047857, #065f46)" 
                : "linear-gradient(to right, #1d4ed8, #6d28d9)";
              e.currentTarget.style.background = bgColor;
              e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isProcessing) {
              const bgColor = hasForm
                ? "linear-gradient(to right, #10b981, #059669)"
                : "linear-gradient(to right, #2563eb, #7c3aed)";
              e.currentTarget.style.background = bgColor;
              e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
            }
          }}
          title={
            !hasForm 
              ? "Navigate to a form to use Nimbus" 
              : "Open Nimbus Template Form"
          }>
          {isProcessing ? (
            <Loader2 style={{ height: "1.5rem", width: "1.5rem" }} className="animate-spin" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ 
                height: "1.5rem", 
                width: "1.5rem",
                transition: "transform 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}>
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          )}
        </button>
      </div>

      {/* Drawer */}
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 9999,
            }}
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "400px",
              backgroundColor: "white",
              boxShadow: "-4px 0 6px -1px rgba(0, 0, 0, 0.1)",
              zIndex: 10001,
              padding: "1.5rem",
              overflowY: "auto",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            }}>
            
            {/* Header */}
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              marginBottom: "1.5rem",
              borderBottom: "1px solid #e5e7eb",
              paddingBottom: "1rem"
            }}>
              <h2 style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                color: "#111827",
                margin: 0
              }}>
                Nimbus Template Form
              </h2>
              <button
                onClick={() => setIsDrawerOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "#6b7280",
                  padding: "0.25rem"
                }}>
                ×
              </button>
            </div>

            {/* Form Fields List */}
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{
                fontSize: "1rem",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "0.75rem"
              }}>
                Detected Form Fields ({formFields.length})
              </h3>
              
              {formFields.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {formFields.map((field, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "0.75rem",
                        backgroundColor: "#f9fafb",
                        border: "1px solid #e5e7eb",
                        borderRadius: "0.375rem",
                        fontSize: "0.875rem",
                        color: "#374151"
                      }}>
                      {field}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{
                  color: "#6b7280",
                  fontSize: "0.875rem",
                  fontStyle: "italic"
                }}>
                  No form fields detected on this page.
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ 
              display: "flex", 
              flexDirection: "column",
              gap: "0.75rem"
            }}>
              <button
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  backgroundColor: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "background-color 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#1d4ed8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#2563eb";
                }}
                onClick={() => {
                  alert('Template generation feature coming soon!');
                }}>
                Generate Template
              </button>
              
              <button
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  backgroundColor: "transparent",
                  color: "#374151",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "background-color 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f9fafb";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
                onClick={() => setIsDrawerOpen(false)}>
                Close
              </button>
            </div>

            {/* Info */}
            <div style={{
              marginTop: "1.5rem",
              padding: "0.75rem",
              backgroundColor: "#eff6ff",
              border: "1px solid #dbeafe",
              borderRadius: "0.375rem",
              fontSize: "0.75rem",
              color: "#1e40af"
            }}>
              Navigate to a Salesforce record edit/create page to see form fields.
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default SalesforceButton
