"use client"

import React from "react"
import { Input, Select } from "@/components/ui"
import { useFileManagerStore } from "../store/useFolderManagerStore"
import type { Category } from "../types"
import { TbFilterOff, TbX } from "react-icons/tb"

interface FolderManagerFiltersProps {
  FileTypeFilter: string
  fileName: string
  fileCategoryFilter: string
  fileYearFilter: string
  documentIdFilter: string 
  isViewingFiles: boolean
  onCategoryChange: (label: string) => void
  onFileTypeChange: (value: string) => void
  onFileNameChange: (value: string) => void
  onYearChange: (value: string) => void
  onDocumentIdChange: (value: string) => void // New handler
}

const FolderManagerFilters: React.FC<FolderManagerFiltersProps> = ({
  FileTypeFilter,
  fileName,
  fileCategoryFilter,
  fileYearFilter,
  documentIdFilter,
  isViewingFiles,
  onFileTypeChange,
  onFileNameChange,
  onCategoryChange,
  onYearChange,
  onDocumentIdChange,
}) => {
  const { folderInfo } = useFileManagerStore()

  // Update categoryOptions to be more robust
  const categoryOptions = React.useMemo(() => {
    return (
      folderInfo?.categories
        ?.filter((cat) => cat && typeof cat === "object")
        .map((cat) => ({
          value: (cat as Category).id,
          label: (cat as Category).name?.split("-")[0] || "Uncategorized",
        })) || []
    )
  }, [folderInfo?.categories])

  // Calculate grid columns based on view mode
  const gridColumns = isViewingFiles ? "md:grid-cols-4" : "md:grid-cols-1"

  // Adjust card width based on view mode
  const cardWidth = isViewingFiles ? "w-full" : "w-full md:w-full"

  // Generate year options for the last 20 years
  const currentYear = new Date().getFullYear()
  const yearOptions = React.useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      value: (currentYear - i).toString(),
      label: (currentYear - i).toString(),
    }))
  }, [])

  // Check if any filters are active
  const hasActiveFilters = fileName || FileTypeFilter || documentIdFilter || fileCategoryFilter || fileYearFilter

  // Clear all filters
  const clearAllFilters = () => {
    onFileNameChange("")
    onFileTypeChange("")
    onCategoryChange("")
    onYearChange("")
    onDocumentIdChange("")
  }

  return (
    <div className={`bg-white shadow-md rounded-lg p-4 mt-4 ${cardWidth} mx-auto`}>
      {/* Filter header with clear button */}
      {hasActiveFilters && (
        <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-200">
          <div className="text-sm font-medium text-blue-600">
            {[fileName, FileTypeFilter, fileCategoryFilter, fileYearFilter, documentIdFilter].filter(Boolean).length}
            filter(s) active
          </div>
          <button onClick={clearAllFilters} className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1">
            <TbFilterOff className="text-sm" />
            Clear All Filters
          </button>
        </div>
      )}

      <div className={`grid grid-cols-1 ${gridColumns} gap-4`}>
        {isViewingFiles && (
          <div>
            <label className="block mb-2 text-sm font-medium text-black">Document ID</label>
            <div className="relative">
              <Input
                type="text"
                placeholder="Enter document ID"
                value={documentIdFilter}
                onChange={(e) => onDocumentIdChange(e.target.value)}
                className="pr-8"
              />
              {documentIdFilter && (
                <button
                  onClick={() => onDocumentIdChange("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <TbX className="text-sm" />
                </button>
              )}
            </div>
          </div>
        )}

        <div>
          <label className="block mb-2 text-sm font-medium text-black">
            {isViewingFiles ? "File Name" : "Folder Name"}
          </label>
          <div className="relative">
            <Input
              type="text"
              placeholder={isViewingFiles ? "Enter file name" : "Enter folder name"}
              value={fileName}
              onChange={(e) => onFileNameChange(e.target.value)}
              className="pr-8"
            />
            {fileName && (
              <button
                onClick={() => onFileNameChange("")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <TbX className="text-sm" />
              </button>
            )}
          </div>
        </div>

        {isViewingFiles && (
          <div>
            <label className="block mb-2 text-sm font-medium text-black">Category</label>
            <Select
              options={categoryOptions.map((option) => ({
                ...option,
                label: option.label.split("-")[0],
              }))}
              placeholder="Select category"
              value={categoryOptions.find((option) => option.label.split("-")[0] === fileCategoryFilter) || null}
              isClearable={true}
              onChange={(option) => {
                if (option && typeof option.label === "string") {
                  onCategoryChange(option.label)
                } else {
                  onCategoryChange("")
                }
              }}
            />
          </div>
        )}

        {isViewingFiles && (
          <div>
            <label className="block mb-2 text-sm font-medium text-black">Year</label>
            <Select
              options={yearOptions}
              placeholder="Select year"
              value={yearOptions.find((option) => option.value === fileYearFilter) || null}
              isClearable={true}
              onChange={(option) => {
                onYearChange(option?.value || "")
              }}
            />
          </div>
        )}
      </div>

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {fileName && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Name: {fileName}
                <button onClick={() => onFileNameChange("")} className="hover:text-blue-900 ml-1">
                  <TbX className="text-xs" />
                </button>
              </span>
            )}
            {FileTypeFilter && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Type: {FileTypeFilter}
                <button onClick={() => onFileTypeChange("")} className="hover:text-green-900 ml-1">
                  <TbX className="text-xs" />
                </button>
              </span>
            )}
            {fileCategoryFilter && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                Category: {fileCategoryFilter}
                <button onClick={() => onCategoryChange("")} className="hover:text-purple-900 ml-1">
                  <TbX className="text-xs" />
                </button>
              </span>
            )}
            {fileYearFilter && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                Year: {fileYearFilter}
                <button onClick={() => onYearChange("")} className="hover:text-orange-900 ml-1">
                  <TbX className="text-xs" />
                </button>
              </span>
            )}

            {documentIdFilter && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                Doc ID: {documentIdFilter}
                <button onClick={() => onDocumentIdChange("")} className="hover:text-indigo-900 ml-1">
                  <TbX className="text-xs" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default FolderManagerFilters

