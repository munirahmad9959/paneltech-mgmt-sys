import React, { useState } from "react"
import { useSelector } from "react-redux"
import { createApiClient } from "../../Utils/Utils"

const EmailPanel = ({ isOpen, onClose, recipient }) => {
  const [emailData, setEmailData] = useState({
    subject: "",
    message: "",
    attachments: [],
  })
  const [sending, setSending] = useState(false)
  const token = useSelector((state) => state.auth.token)
  const ApiClient = React.useMemo(() => createApiClient(), [])

  // Reset form when recipient changes
  React.useEffect(() => {
    if (recipient) {
      setEmailData({
        subject: "",
        message: "",
        attachments: [],
      })
    }
  }, [recipient])

  const handleChange = (e) => {
    const { name, value } = e.target
    setEmailData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)

    // Check file size (limit to 10MB per file)
    const oversizedFiles = files.filter((file) => file.size > 10 * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      alert("Some files exceed the 10MB limit and were not added")
      const validFiles = files.filter((file) => file.size <= 10 * 1024 * 1024)
      setEmailData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...validFiles],
      }))
      return
    }

    setEmailData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }))
  }

  const removeAttachment = (index) => {
    setEmailData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!emailData.subject.trim()) {
      alert("Please enter a subject")
      return
    }

    if (!emailData.message.trim()) {
      alert("Please enter a message")
      return
    }

    try {
      setSending(true)

      // Create FormData for the API request
      const formData = new FormData()
      formData.append("to", recipient.user.email)
      formData.append("recipientName", recipient.user.fullName)
      formData.append("subject", emailData.subject)
      formData.append("message", emailData.message)

      // Add attachments if any
      emailData.attachments.forEach((file) => {
        formData.append("attachments", file)
      })

      // Send the email using your API client
      const response = await ApiClient.post("/email/send", formData, {
        headers: {
          Authorization: `bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.data.success) {
        alert("Email sent successfully")
        onClose()
      } else {
        throw new Error(response.data.message || "Failed to send email")
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send email. Please try again.")
    } finally {
      setSending(false)
    }
  }

  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 backdrop-blur-xs bg-opacity-30" onClick={onClose}></div>

      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="relative w-screen max-w-md">
          <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
            {/* Header */}
            <div className="px-6 py-4 bg-blue-600 text-white flex items-center justify-between">
              <h2 className="text-lg font-semibold">Compose Email</h2>
              <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Recipient */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To:</label>
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-600">
                          {recipient?.user?.fullName?.charAt(0) || "U"}
                        </span>
                      </div>
                      <span className="text-sm text-gray-700">
                        {recipient?.user?.fullName} &lt;{recipient?.user?.email}&gt;
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject:
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={emailData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter email subject"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message:
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={emailData.message}
                    onChange={handleChange}
                    rows={10}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Write your message here..."
                  ></textarea>
                </div>

                {/* Attachments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Attachments:</label>

                  {emailData.attachments.length > 0 && (
                    <div className="mb-3 space-y-2">
                      {emailData.attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <svg
                              className="w-4 h-4 shrink-0 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                              />
                            </svg>
                            <div className="flex flex-col overflow-hidden">
                              <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                              <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttachment(index)}
                            className="text-gray-500 hover:text-red-500 shrink-0 ml-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-3 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <p className="mb-1 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PDF, DOC, XLS, JPG, PNG (Max 10MB)</p>
                      </div>
                      <input type="file" className="hidden" multiple onChange={handleFileChange} />
                    </label>
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={sending}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center gap-2 cursor-pointer"
              >
                {sending ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    Send Email
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailPanel
