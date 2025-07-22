

"use client"

import type React from "react"
import { useEffect, useState } from "react"
import * as XLSX from "xlsx"

interface ExcelViewerProps {
  file: Blob
}

const ExcelViewer: React.FC<ExcelViewerProps> = ({ file }) => {
  const [data, setData] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const readExcel = async () => {
      setError(null)
      try {
        const arrayBuffer = await file.arrayBuffer()
        const workbook = XLSX.read(arrayBuffer, { type: "array" })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const json = XLSX.utils.sheet_to_json(sheet, { header: 1 })
        setData(json)
      } catch (err) {
        console.error("Error reading Excel file:", err)
        setError("Failed to load Excel file. It might be corrupted or an unsupported format.")
      }
    }
    readExcel()
  }, [file])

  if (error) {
    return <div className="flex items-center justify-center h-full text-red-500">{error}</div>
  }

  if (data.length === 0) {
    return <div className="flex items-center justify-center h-full text-gray-500">Loading Excel data...</div>
  }

  return (
    <div className="overflow-auto p-5 flex justify-center items-center h-[77vh]">
      <table className="border-collapse border border-gray-300 text-sm">
        <thead>
          {data[0] && ( // Assuming first row is header
            <tr>
              {data[0].map((cell: any, j: number) => (
                <th
                  key={j}
                  className="border border-gray-300 px-3 py-1 bg-gray-100 font-semibold text-gray-700 whitespace-nowrap"
                >
                  {cell}
                </th>
              ))}
            </tr>
          )}
        </thead>
        <tbody>
          {data.slice(1).map(
            (
              row: any,
              i: number, // Slice to skip header row
            ) => (
              <tr key={i} className="hover:bg-gray-50">
                {row.map((cell: any, j: number) => (
                  <td key={j} className="border border-gray-300 px-3 py-1 whitespace-nowrap">
                    {cell}
                  </td>
                ))}
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  )
}

export default ExcelViewer
