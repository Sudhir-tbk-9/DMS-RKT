"use client"

import type React from "react"
import DocxViewer from "./DocxViewer"
import ExcelViewer from "./ExcelViewer"
import { getFileExtension } from "../../lib/utils"
import PdfViewer from "./PdfViewer"

interface FilePreviewerProps {
  documentBlob: Blob
  fileName: string
}

const FilePreviewer: React.FC<FilePreviewerProps> = ({ documentBlob, fileName }) => {
  const fileType = documentBlob.type
  const extension = getFileExtension(fileName)
    console.log("📄 File preview requested:", fileName, "Type:", fileType, "Extension:", extension)

  if (!documentBlob) {
    return <p>No file to preview.</p>
  }

  if (extension === "docx" || fileType.includes("wordprocessingml")) {
    return <DocxViewer file={documentBlob} />
  }
  if (extension === "pdf") {
    return <PdfViewer file={documentBlob} />
  }
  if (extension === "xlsx" || fileType.includes("spreadsheetml") || extension === "csv") {
    return <ExcelViewer file={documentBlob} />
  }

  // Fallback for types not handled by specific viewers (should ideally not be reached if FolderManager routes correctly)
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50 ml-40">
      <div className="text-center p-8">
        <div className="text-6xl text-gray-400 mb-4">📄</div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Preview Not Available</h3>
        <p className="text-gray-600 mb-4">
          This file type ({extension.toUpperCase() || fileType}) cannot be previewed in the browser.
        </p>
      </div>
    </div>
  )
}

export default FilePreviewer
