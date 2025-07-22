// "use client"

// import React from "react"
// import { Input, Select, Button } from "@/components/ui"
// import { useFileManagerStore } from "../store/useFolderManagerStore"
// import type { Category } from "../types"
// import { TbFilter, TbFilterOff, TbX } from "react-icons/tb"

// interface FolderManagerFiltersProps {
//   FileTypeFilter: string
//   fileName: string
//   fileCategoryFilter: string
//   fileYearFilter: string
//   isViewingFiles: boolean
//   onCategoryChange: (label: string) => void
//   onFileTypeChange: (value: string) => void
//   onFileNameChange: (value: string) => void
//   onYearChange: (value: string) => void
// }

// const FolderManagerFiltersImproved: React.FC<FolderManagerFiltersProps> = ({
//   FileTypeFilter,
//   fileName,
//   fileCategoryFilter,
//   fileYearFilter,
//   isViewingFiles,
//   onFileTypeChange,
//   onFileNameChange,
//   onCategoryChange,
//   onYearChange,
// }) => {
//   const { folderInfo, showFilters, setShowFilters } = useFileManagerStore()

//   // Enhanced category options with better handling
//   const categoryOptions = React.useMemo(() => {
//     if (!folderInfo?.categories) return []

//     return folderInfo.categories.map((cat) => {
//       const category = cat as Category
//       return {
//         value: category.id || category.name,
//         label: category.name,
//       }
//     })
//   }, [folderInfo?.categories])

//   // File type options (you can expand this based on your needs)
//   const fileTypeOptions = [
//     { value: "pdf", label: "PDF" },
//     { value: "doc", label: "Word Document" },
//     { value: "docx", label: "Word Document (DOCX)" },
//     { value: "xls", label: "Excel" },
//     { value: "xlsx", label: "Excel (XLSX)" },
//     { value: "ppt", label: "PowerPoint" },
//     { value: "pptx", label: "PowerPoint (PPTX)" },
//     { value: "txt", label: "Text File" },
//     { value: "jpg", label: "JPEG Image" },
//     { value: "png", label: "PNG Image" },
//     { value: "directory", label: "Folder" },
//   ]

//   // Generate year options for the last 20 years
//   const yearOptions = React.useMemo(() => {
//     const currentYear = new Date().getFullYear()
//     return Array.from({ length: 20 }, (_, i) => ({
//       value: (currentYear - i).toString(),
//       label: (currentYear - i).toString(),
//     }))
//   }, [])

//   // Check if any filters are active
//   const hasActiveFilters = fileName || FileTypeFilter || fileCategoryFilter || fileYearFilter

//   // Clear all filters
//   const clearAllFilters = () => {
//     onFileNameChange("")
//     onFileTypeChange("")
//     onCategoryChange("")
//     onYearChange("")
//   }

//   // Toggle filter visibility
//   const toggleFilters = () => {
//     setShowFilters(!showFilters)
//   }

//   return (
//     <div className="space-y-4">
//       {/* Filter Toggle Header */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <Button variant="outline" size="sm" onClick={toggleFilters} className="flex items-center gap-2">
//             <TbFilter className="text-lg" />
//             <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
//           </Button>

//           {hasActiveFilters && (
//             <div className="flex items-center gap-2">
//               <span className="text-sm text-blue-600 font-medium">
//                 {[fileName, FileTypeFilter, fileCategoryFilter, fileYearFilter].filter(Boolean).length} filter(s) active
//               </span>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={clearAllFilters}
//                 className="text-red-600 hover:text-red-700 flex items-center gap-1"
//               >
//                 <TbFilterOff className="text-sm" />
//                 Clear All
//               </Button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Filter Panel */}
//       {showFilters && (
//         <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold text-gray-900">Filter {isViewingFiles ? "Files" : "Folders"}</h3>
//             <Button variant="ghost" size="sm" onClick={toggleFilters} className="text-gray-500 hover:text-gray-700">
//               <TbX className="text-lg" />
//             </Button>
//           </div>

//           <div
//             className={`grid grid-cols-1 ${isViewingFiles ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-1"} gap-4`}
//           >
//             {/* Name Filter */}
//             <div>
//               <label className="block mb-2 text-sm font-medium text-gray-700">
//                 {isViewingFiles ? "File Name" : "Folder Name"}
//               </label>
//               <div className="relative">
//                 <Input
//                   type="text"
//                   placeholder={isViewingFiles ? "Search files..." : "Search folders..."}
//                   value={fileName}
//                   onChange={(e) => onFileNameChange(e.target.value)}
//                   className="pr-8"
//                 />
//                 {fileName && (
//                   <button
//                     onClick={() => onFileNameChange("")}
//                     className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                   >
//                     <TbX className="text-sm" />
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* File Type Filter - Only for files */}
//             {isViewingFiles && (
//               <div>
//                 <label className="block mb-2 text-sm font-medium text-gray-700">File Type</label>
//                 <Select
//                   options={fileTypeOptions}
//                   placeholder="Select file type"
//                   value={fileTypeOptions.find((option) => option.value === FileTypeFilter) || null}
//                   isClearable={true}
//                   onChange={(option) => {
//                     onFileTypeChange(option?.value || "")
//                   }}
//                 />
//               </div>
//             )}

//             {/* Category Filter - Only for files */}
//             {isViewingFiles && (
//               <div>
//                 <label className="block mb-2 text-sm font-medium text-gray-700">Category</label>
//                 <Select
//                   options={categoryOptions}
//                   placeholder="Select category"
//                   value={categoryOptions.find((option) => option.label === fileCategoryFilter) || null}
//                   isClearable={true}
//                   onChange={(option) => {
//                     onCategoryChange(option?.label || "")
//                   }}
//                   noOptionsMessage={() => "No categories available"}
//                 />
//               </div>
//             )}

//             {/* Year Filter - Only for files */}
//             {isViewingFiles && (
//               <div>
//                 <label className="block mb-2 text-sm font-medium text-gray-700">Year</label>
//                 <Select
//                   options={yearOptions}
//                   placeholder="Select year"
//                   value={yearOptions.find((option) => option.value === fileYearFilter) || null}
//                   isClearable={true}
//                   onChange={(option) => {
//                     onYearChange(option?.value || "")
//                   }}
//                 />
//               </div>
//             )}
//           </div>

//           {/* Active Filters Summary */}
//           {hasActiveFilters && (
//             <div className="mt-4 pt-4 border-t border-gray-200">
//               <div className="flex flex-wrap gap-2">
//                 <span className="text-sm font-medium text-gray-700">Active filters:</span>
//                 {fileName && (
//                   <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
//                     Name: {fileName}
//                     <button onClick={() => onFileNameChange("")} className="hover:text-blue-900">
//                       <TbX className="text-xs" />
//                     </button>
//                   </span>
//                 )}
//                 {FileTypeFilter && (
//                   <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
//                     Type: {FileTypeFilter}
//                     <button onClick={() => onFileTypeChange("")} className="hover:text-green-900">
//                       <TbX className="text-xs" />
//                     </button>
//                   </span>
//                 )}
//                 {fileCategoryFilter && (
//                   <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
//                     Category: {fileCategoryFilter}
//                     <button onClick={() => onCategoryChange("")} className="hover:text-purple-900">
//                       <TbX className="text-xs" />
//                     </button>
//                   </span>
//                 )}
//                 {fileYearFilter && (
//                   <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
//                     Year: {fileYearFilter}
//                     <button onClick={() => onYearChange("")} className="hover:text-orange-900">
//                       <TbX className="text-xs" />
//                     </button>
//                   </span>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   )
// }

// export default FolderManagerFiltersImproved
