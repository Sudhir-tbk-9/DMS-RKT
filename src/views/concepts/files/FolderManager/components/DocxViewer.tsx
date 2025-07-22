"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { renderAsync } from "docx-preview"

interface DocxViewerProps {
  file: Blob
}

const DocxViewer: React.FC<DocxViewerProps> = ({ file }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (file && containerRef.current) {
      // docx-preview expects a Blob or File object
      renderAsync(file, containerRef.current)
    }
  }, [file])

  return <div ref={containerRef} className="w-full h-[76vh] overflow-auto" />
}

export default DocxViewer
