// PreviewFileEnhanced.tsx
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Dialog from "@/components/ui/Dialog"
import PdfViewer from "./PdfViewer"
import DocxViewer from "./DocxViewer"
import ExcelViewer from "./ExcelViewer"
import { getFileExtension } from "../../lib/utils"
import { TbX } from "react-icons/tb"

interface DocumentPreviewProps {
  documentBlob: Blob | null
  fileName?: string
  onClose: () => void
  viewerType: "pdf" | "image" | "text" | "docx" | "xlsx" | "unsupported"
  previewUrl?: string | null
}

const DocumentPreviewEnhanced: React.FC<DocumentPreviewProps> = ({
  documentBlob,
  fileName = "Document",
  onClose,
  viewerType,
  previewUrl,
}) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  useEffect(() => {
    if (documentBlob && viewerType === "pdf") {
      const url = URL.createObjectURL(documentBlob);
      setPdfUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [documentBlob, viewerType])

  const handleLoad = () => {
    setLoading(false)
  }

  const handleError = () => {
    setLoading(false)
    setError("Failed to load preview")
  }

  const renderPreviewContent = () => {
    if (!documentBlob) return null

  if (viewerType === "pdf") {
  return pdfUrl ? <PdfViewer pdfFile={pdfUrl} /> : <p>Loading PDF...</p>
}

    if (viewerType === "docx") {
      return <DocxViewer file={documentBlob} />
    }
    if (viewerType === "xlsx") {
      return <ExcelViewer file={documentBlob} />
    }
    if (viewerType === "image") {
      return previewUrl ? (
        <div className="flex items-center justify-center h-full bg-gray-100">
          <img
            src={previewUrl}
            alt={fileName}
            className="max-w-full max-h-full object-contain"
            onLoad={handleLoad}
            onError={handleError}
          />
        </div>
      ) : (
        <p>Loading image...</p>
      )
    }
    if (viewerType === "text") {
      return previewUrl ? (
        <div className="p-4 h-full overflow-auto bg-white">
          <iframe
            src={previewUrl}
            className="w-full h-full border-0"
            title={fileName}
            onLoad={handleLoad}
            onError={handleError}
          />
        </div>
      ) : (
        <p>Loading text...</p>
      )
    }

    // Fallback for unsupported types
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50">
        <div className="text-center p-8">
          <div className="text-6xl text-gray-400 mb-4">📄</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Preview Not Available</h3>
          <p className="text-gray-600 mb-4">
            This file type ({getFileExtension(fileName).toUpperCase() || viewerType}) cannot be previewed.
          </p>
        </div>
      </div>
    )
  }

  if (!documentBlob) return null

  return (
    <Dialog 
      isOpen={!!documentBlob} 
      onClose={onClose} 
      width="65vw"
      height="100vh"
      className="z-[1000]"
    >
      <div className="flex flex-col h-full relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white z-10">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{fileName}</h3>
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded uppercase">
              {getFileExtension(fileName)}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors z-50"
          >
            <TbX className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 h-[100vh] relative bg-gray-50">
          {loading && (viewerType === "image" || viewerType === "text") && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Loading preview...</p>
              </div>
            </div>
          )}

          {error && (viewerType === "image" || viewerType === "text") && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <div className="text-center p-8">
                <div className="text-4xl text-red-400 mb-4">⚠️</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Preview Error</h3>
                <p className="text-gray-600 mb-4">{error}</p>
              </div>
            </div>
          )}

          {renderPreviewContent()}
        </div>
      </div>
    </Dialog>
  )
}

export default DocumentPreviewEnhanced
