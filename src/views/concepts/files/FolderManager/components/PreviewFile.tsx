"use client"

import type React from "react"
import { useEffect } from "react"
import Dialog from "@/components/ui/Dialog"
import Button from "@/components/ui/Button"
import { TbX, TbDownload, TbExternalLink } from "react-icons/tb" // Using Lucide React icons
import FilePreviewer from "./FilePreviewer" // Import the new FilePreviewer

interface DocumentPreviewProps {
  documentBlob: Blob | null
  fileName: string
  onClose: () => void
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ documentBlob, fileName, onClose }) => {
  useEffect(() => {
    if (documentBlob) {
      // No specific loading/error state here, as FilePreviewer handles it for its children
    }
  }, [documentBlob])

  const handleDownload = () => {
    if (documentBlob && fileName) {
      const url = URL.createObjectURL(documentBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }

  const handleOpenInNewTab = () => {
    if (documentBlob && fileName) {
      const url = URL.createObjectURL(documentBlob)
      window.open(url, "_blank")
      // Note: The object URL created here will not be automatically revoked.
      // For long-lived previews, consider a different approach or manual revocation.
    }
  }

  const getFileExtension = (filename: string) => {
    return filename.split(".").pop()?.toLowerCase() || ""
  }

  if (!documentBlob) return null

  return (
    <Dialog isOpen={!!documentBlob} onClose={onClose} width="90vw" height="90vh" className="!max-w-6xl !max-h-[90vh]">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{fileName}</h3>
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded uppercase">
              {getFileExtension(fileName)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleDownload}>
              <TbDownload className="mr-1" />
              Download
            </Button>
            <Button size="sm" variant="outline" onClick={handleOpenInNewTab}>
              <TbExternalLink className="mr-1" />
              Open
            </Button>
            <Button size="sm" variant="ghost" onClick={onClose}>
              <TbX className="text-lg" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 relative">
          {documentBlob && <FilePreviewer documentBlob={documentBlob} fileName={fileName} />}
        </div>
      </div>
    </Dialog>
  )
}

export default DocumentPreview

