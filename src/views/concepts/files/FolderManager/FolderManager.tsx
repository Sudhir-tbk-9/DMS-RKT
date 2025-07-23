"use client"

import { useEffect, useState } from "react"
import Table from "@/components/ui/Table"
import TableRowSkeleton from "@/components/shared/loaders/TableRowSkeleton"
import FileManagerHeader from "./components/FolderManagerHeader"
import FileSegment from "./components/FileSegment"
import FileList from "./components/FolderList"
import FileDetails from "./components/FolderDetails"
import FileManagerDeleteDialog from "./components/FileManagerDeleteDialog"
import FileManagerInviteDialog from "./components/FileManagerInviteDialog"
import { useFileManagerStore } from "./store/useFolderManagerStore"
import { apiDocPreview, apiGetdoc, apiGetFolders } from "@/services/FileService"
import useSWRMutation from "swr/mutation"
import type { GetFilesListResponse, GetFoldersListResponse } from "./types"
import "../../../../assets/styles/app.css"
import FileManagerRenameDialog from "./components/FileMangerRenameDialog"
import FolderEdit from "./components/FolderEdit"
import FolderManagerFilters from "./components/FileMangerFilter"
import { useSessionUser } from "@/store/authStore"
import { getFileExtension } from "../lib/utils"
import DocumentPreviewEnhanced from "./components/PreviewFileEnhanced"

const { THead, Th, Tr } = Table

async function getFile(
  _: string,
  { arg }: { arg: { id?: string; name?: string; ids?: number[]; documentId?: string; page?: number; size?: number } },
): Promise<GetFoldersListResponse> {
  // Use the updated type
  try {
    const params: { id?: string; name?: string; ids?: number[]; documentId?: string; page?: number; size?: number } = {}
    if (arg.id) {
      params.id = arg.id
    }
    if (arg.ids) {
      params.ids = arg.ids
    }
    if (arg.name) {
      params.name = arg.name
    }
    if (arg.documentId) {
      params.documentId = arg.documentId
    }
    if (arg.page !== undefined) {
      params.page = arg.page
    }
    if (arg.size !== undefined) {
      params.size = arg.size
    }

    const data = await apiGetFolders(params) // Call with updated params

    if (!data || !data.data || data.data.content.length === 0) {
      console.log("No folders")
      return {
        message: "No folders found",
        status: 200,
        data: { content: [], page: { totalElements: 0, totalPages: 1, number: 0, size: params.size || 10 } },
      }
    }
    return data
  } catch (error) {
    console.error("Error fetching folders:", error)
    return {
      message: "Error fetching folders",
      status: 500,
      data: { content: [], page: { totalElements: 0, totalPages: 1, number: 0, size: arg.size || 10 } },
    }
  }
}

async function getdoc(
  _: string,
  {
    arg,
  }: {
    arg: {
      id: string
      page: number
      size: number
      name?: string
      fileType?: string
      fileCategory?: string
      year?: string
      documentNumber?: string
    }
  },
): Promise<GetFilesListResponse> {
  // Use the updated type
  const data = await apiGetdoc({
    id: arg.id,
    page: arg.page,
    size: arg.size,
    name: arg.name || undefined,
    fileType: arg.fileType || undefined,
    fileCategory: arg.fileCategory || undefined,
    year: arg.year || undefined,
    documentNumber: arg.documentNumber || undefined,
  })
  return data
}

const FolderManager = () => {
  const {
    layout,
    fileList,
    setFileList,
    setDeleteDialog,
    setInviteDialog,
    setRenameDialog,
    openedDirectoryId,
    setOpenedDirectoryId,
    setDirectories,
    setfolderInfo,
    setSelectedFile,
    setFolderEditDialog,
    showFilters,
    folderPage,
    folderPageSize,
    folderTotalItems,
    folderTotalPages,
    setFolderPage,
    setFolderPageSize,
    setFolderTotalItems,
    setFolderTotalPages,
    filePage,
    filePageSize,
    fileTotalItems,
    fileTotalPages,
    setFilePage,
    setFilePageSize,
    setFileTotalItems,
    setFileTotalPages,
    resetPagination,
  } = useFileManagerStore()

  // State to hold preview information for different viewers
  const [previewInfo, setPreviewInfo] = useState<{
    documentBlob: Blob | null
    fileName: string
    viewerType: "pdf" | "image" | "text" | "docx" | "xlsx" | "unsupported"
    objectUrl?: string | null // Only for image and text files
  } | null>(null)

  const [FileTypeFilter, setSelectedFileType] = useState<string>("")
  const [fileNameFilter, setFileNameFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [yearFilter, setYearFilter] = useState("")
  const [documentIdFilter, setDocumentIdFilter] = useState("")
  const user = useSessionUser((state) => state.user)

  useEffect(() => {
    if (openedDirectoryId) {
      const currentFolder = fileList.find((f) => f.id === openedDirectoryId)
      if (currentFolder) {
        setfolderInfo({
          categories: currentFolder.categories || [],
          name: currentFolder.name,
        })
      }
    }
  }, [openedDirectoryId, fileList, setfolderInfo])

  const { trigger: triggerGetFile, isMutating: isFileMutating } = useSWRMutation(`/project-files`, getFile, {
    onSuccess: (resp) => {
      if (resp && resp.data) {
        console.log("✅ Folder API Success:", {
          content: resp.data.content?.length,
          totalElements: resp.data.page?.totalElements,
          totalPages: resp.data.page?.totalPages,
          currentPage: resp.data.page?.number,
        })

        setDirectories([])
        if (Array.isArray(resp.data.content)) {
          setFileList(resp.data.content)
          setFolderTotalItems(resp.data.page?.totalElements || 0)
          setFolderTotalPages(resp.data.page?.totalPages || 1)
        } else {
          console.error("Unexpected data format:", resp.data)
          setFileList([])
          setFolderTotalItems(0)
          setFolderTotalPages(1)
        }
      } else {
        console.log("No folders found")
        setFileList([])
        setFolderTotalItems(0)
        setFolderTotalPages(1)
      }
    },
  })

  const { trigger: triggerGetDoc, isMutating: isDocMutating } = useSWRMutation(
    `/documents?folderId=${openedDirectoryId}`,
    getdoc,
    {
      onSuccess: (resp) => {
        if (resp && resp.data) {
          console.log("Response from getFiles:", resp.data.content)
          const directoryMap = new Map()
          resp.data.content.forEach((item) => {
            const label = item.folder
            if (!directoryMap.has(label)) {
              directoryMap.set(label, { id: item.id.toString(), label })
            }
          })

          const mappedDirectories = Array.from(directoryMap.values())
          setDirectories(mappedDirectories)
          setFileList(resp.data.content)
          setFileTotalItems(resp.data.page.totalElements)
          setFileTotalPages(resp.data.page.totalPages)
        } else {
          console.log("No files found")
          setFileList([])
          setFileTotalItems(0)
          setFileTotalPages(1)
        }
      },
    },
  )

  useEffect(() => {
    if (openedDirectoryId) {
      triggerGetDoc({
        id: openedDirectoryId,
        page: filePage,
        size: filePageSize,
        name: fileNameFilter || undefined,
        fileType: FileTypeFilter || undefined,
        fileCategory: categoryFilter || undefined,
        year: yearFilter || undefined,
        documentNumber: documentIdFilter || undefined,
      })
    } else if (user.projectFileIds && user.projectFileIds.length > 0) {
      triggerGetFile({
        ids: user.projectFileIds,
        page: folderPage,
        size: folderPageSize,
        name: fileNameFilter || undefined,
        documentId: documentIdFilter || undefined, // Pass documentId filter for folders
      })
    }
  }, [
    openedDirectoryId,
    filePage,
    filePageSize,
    fileNameFilter,
    yearFilter,
    FileTypeFilter,
    categoryFilter,
    documentIdFilter,
    triggerGetDoc,
    triggerGetFile,
    folderPage,
    folderPageSize,
    user.projectFileIds,
  ])

  const handleShare = (id: string) => {
    setInviteDialog({ id, open: true })
  }
  const handleFolderEdit = (id: string) => {
    const folder = fileList.find((f) => f.id === id && f.fileType === "directory")
    console.log("Folder to edit:", folder)

    if (folder) {
      setFolderEditDialog({
        id,
        foldername: folder.name,
        description: folder.description || "",
        categories: folder.categories || [],
        open: true,
      })
    }
  }
  const handleDelete = (id: string) => {
    const file = fileList.find((f) => f.id === id)
    if (!file) return
    setDeleteDialog({ id, open: true, fileType: file.fileType })
  }

  const handleRename = (id: string) => {
    const fileToRename = fileList.find((file) => file.id === id)
    if (fileToRename) {
      console.log(" Click option Rename file ", id, fileToRename.name)
      setRenameDialog({
        id,
        filename: fileToRename.name,
        open: true,
      })
    }
  }
  const handleDetails = (itemId: string) => {
    setSelectedFile(itemId)
  }
  const handleDownload = async (fileId: string) => {
    try {
      const file = fileList.find((f) => f.id === fileId)
      if (!file) {
        console.error("File not found")
        return
      }
      const response = await apiDocPreview<BlobPart, { id: string }>({
        id: fileId,
      })

      // Determine MIME type based on file extension for download
      const fileExtension = getFileExtension(file.name)
      let mimeType = "application/octet-stream"
      switch (fileExtension) {
        case "pdf":
          mimeType = "application/pdf"
          break
        case "jpg":
        case "jpeg":
          mimeType = "image/jpeg"
          break
        case "png":
          mimeType = "image/png"
          break
        case "gif":
          mimeType = "image/gif"
          break
        case "bmp":
          mimeType = "image/bmp"
          break
        case "webp":
          mimeType = "image/webp"
          break
        case "doc":
          mimeType = "application/msword"
          break
        case "docx":
          mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          break
        case "xls":
          mimeType = "application/vnd.ms-excel"
          break
        case "xlsx":
          mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          break
        case "ppt":
          mimeType = "application/vnd.ms-powerpoint"
          break
        case "pptx":
          mimeType = "application/vnd.openxmlformats-officedocument.presentationml.presentation"
          break
        case "txt":
          mimeType = "text/plain"
          break
      }

      const blob = new Blob([response], { type: mimeType })

      const url = URL.createObjectURL(blob)
      console.log("URL:", url)

      const link = document.createElement("a")
      link.href = window.URL.createObjectURL(blob)
      link.download = file.name || "document"
      document.body.appendChild(link)

      link.click()

      document.body.removeChild(link)
      window.URL.revokeObjectURL(link.href)
    } catch (error) {
      console.error("Error fetching file for download:", error)
    }
  }

  const handlePreview = async (fileId: string) => {
    try {
      const file = fileList.find((f) => f.id === fileId)
      if (!file) {
        console.error("File not found")
        return
      }

      console.log("📄 Previewing file:", file.name, "Type:", file.fileType)

      const response = await apiDocPreview<BlobPart, { id: string }>({
        id: fileId,
      })

      const blob = new Blob([response], {
        type: file.fileType || "application/octet-stream",
      })
      const fileExtension = getFileExtension(file.fileType)

      // Determine which viewer to use and set previewInfo accordingly
      if (fileExtension === "pdf") {
        const url = URL.createObjectURL(blob)
        setPreviewInfo({
          documentBlob: blob,
          fileName: file.name,
          viewerType: "pdf",
          objectUrl: url, // Add this line
        })
        console.log("📄 PDF preview URL created:", url)
      } else if (["docx"].includes(fileExtension) || file.fileType?.includes("wordprocessingml")) {
        setPreviewInfo({
          documentBlob: blob,
          fileName: file.name,
          viewerType: "docx",
        })
        console.log("📄 Word preview URL created:", URL.createObjectURL(blob))
      } else if (["xlsx", "csv"].includes(fileExtension) || file.fileType?.includes("spreadsheetml")) {
        setPreviewInfo({
          documentBlob: blob,
          fileName: file.name,
          viewerType: "xlsx",
        })
        console.log("📊 Excel preview URL created:", URL.createObjectURL(blob))
      } else if (
        ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(fileExtension) ||
        file.fileType?.startsWith("image/")
      ) {
        const url = URL.createObjectURL(blob)
        setPreviewInfo({
          documentBlob: blob,
          fileName: file.name,
          viewerType: "image",
          objectUrl: url,
        })
        console.log("📷 Image preview URL created:", url)
      } else if (fileExtension === "txt" || file.fileType?.startsWith("text/")) {
        const url = URL.createObjectURL(blob)
        setPreviewInfo({
          documentBlob: blob,
          fileName: file.name,
          viewerType: "text",
          objectUrl: url,
        })
        console.log("📄 Text preview URL created:", url)
      } else {
        // Fallback for unsupported types, still using DocumentPreviewEnhanced for its UI
        setPreviewInfo({
          documentBlob: blob,
          fileName: file.name,
          viewerType: "unsupported",
        })
        console.log("📁 Unsupported file type for preview:", fileExtension, "Using DocumentPreviewEnhanced as fallback")
      }
    } catch (error) {
      console.error("Error fetching file preview:", error)
    }
  }

  const handleClick = (itemId: string) => {
    const clickedItem = fileList.find((item) => item.id === itemId)
    if (clickedItem) {
      if (clickedItem.categories) {
        setfolderInfo({
          categories: clickedItem.categories,
          name: clickedItem.name,
        })
      } else {
        setfolderInfo(null)
      }
      if (clickedItem.fileType === "directory") {
        setOpenedDirectoryId(itemId)
        setFilePage(0)
        // Clear filters when entering a directory
        setFileNameFilter("")
        setSelectedFileType("")
        setCategoryFilter("")
        setYearFilter("")
        setDocumentIdFilter("")
        triggerGetDoc({
          id: itemId,
          page: 0,
          size: filePageSize,
          name: "",
          fileType: "",
          fileCategory: "",
          year: "",
          documentNumber: "",
        })
      } else {
        handlePreview(itemId)
      }
    }
  }

  const handleClosePreview = () => {
    if (previewInfo?.objectUrl) {
      URL.revokeObjectURL(previewInfo.objectUrl)
    }
    setPreviewInfo(null)
  }

  const handleOpen = (id: string) => {
    const clickedItem = fileList.find((item) => item.id === id)

    if (clickedItem) {
      if (clickedItem.categories) {
        setfolderInfo({
          categories: clickedItem.categories,
          name: clickedItem.name,
        })
      } else {
        setfolderInfo(null)
      }
    }
    setOpenedDirectoryId(id)
    setFilePage(0)
    setFileNameFilter("")
    setSelectedFileType("")
    setCategoryFilter("")
    setYearFilter("")
    setDocumentIdFilter("")
    triggerGetDoc({
      id: id,
      page: 0,
      size: filePageSize,
      name: "",
      fileType: "",
      fileCategory: "",
      year: "",
      documentNumber: "",
    })
  }

  const handleEntryClick = () => {
    setOpenedDirectoryId("")
    setFolderPage(0)
    // Clear filters when going back to top-level folders
    setFileNameFilter("")
    setSelectedFileType("")
    setCategoryFilter("")
    setYearFilter("")
    setDocumentIdFilter("")
    if (user.projectFileIds && user.projectFileIds.length > 0) {
      triggerGetFile({
        ids: user.projectFileIds,
        page: 0,
        size: folderPageSize,
        name: "", // Pass empty string to API for new filter state
        documentId: "", // Pass empty string for folder documentId
      })
    }
  }

  const handleDirectoryClick = (id: string) => {
    console.log(`Directory clicked: ${id}`)
    setOpenedDirectoryId(id)
    setFilePage(0)
    setFileNameFilter("")
    setSelectedFileType("")
    setCategoryFilter("")
    setYearFilter("")
    setDocumentIdFilter("")
    triggerGetDoc({
      id: id,
      page: 0,
      size: filePageSize,
      name: "",
      fileType: "",
      fileCategory: "",
      year: "",
      documentNumber: "",
    })
  }

  const handleFolderPaginationChange = (page: number) => {
    setFolderPage(page)
  }
  const handleFolderPageSizeChange = (value: number) => {
    setFolderPageSize(value)
    setFolderPage(0)
  }

  const handleFilePaginationChange = (page: number) => {
    setFilePage(page)
  }
  const handleFilePageSizeChange = (value: number) => {
    setFilePageSize(value)
    setFilePage(0)
  }

  const setDocumentIdChange = (value: string) => {
    setDocumentIdFilter(value)
  }

  return (
    <>
      <div>
        <FileManagerHeader
          isFileView={!!openedDirectoryId}
          onEntryClick={handleEntryClick}
          onDirectoryClick={handleDirectoryClick}
        />
        {showFilters && (
          <FolderManagerFilters
            fileName={fileNameFilter}
            FileTypeFilter={FileTypeFilter}
            fileCategoryFilter={categoryFilter}
            isViewingFiles={!!openedDirectoryId}
            fileYearFilter={yearFilter}
            onYearChange={setYearFilter}
            onFileNameChange={setFileNameFilter}
            onFileTypeChange={setSelectedFileType}
            onCategoryChange={setCategoryFilter}
            documentIdFilter={documentIdFilter}
            onDocumentIdChange={setDocumentIdChange}
          />
        )}
        <div className="mt-6">
          {isFileMutating || isDocMutating ? (
            layout === "grid" ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 mt-4 gap-4 lg:gap-6">
                {[...Array(4).keys()].map((item) => (
                  <FileSegment key={item} id={`loading-${item}`} loading={isFileMutating || isDocMutating} />
                ))}
              </div>
            ) : (
              <Table>
                <THead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>File</Th>
                    <Th>Size</Th>
                    <Th>Type</Th>
                    <Th>Catgory</Th>
                  </Tr>
                </THead>
                <TableRowSkeleton
                  avatarInColumns={[0]}
                  columns={4}
                  rows={5}
                  avatarProps={{
                    width: 30,
                    height: 30,
                  }}
                />
              </Table>
            )
          ) : (
            <>
              <FileList
                fileList={fileList}
                layout={layout}
                openedDirectoryId={openedDirectoryId}
                triggerGetDoc={triggerGetDoc}
                triggerGetFile={triggerGetFile}
                currentPage={openedDirectoryId ? filePage : folderPage}
                totalItems={openedDirectoryId ? fileTotalItems : folderTotalItems}
                totalPages={openedDirectoryId ? fileTotalPages : folderTotalPages}
                pageSize={openedDirectoryId ? filePageSize : folderPageSize}
                onDownload={handleDownload}
                onShare={handleShare}
                onDelete={handleDelete}
                onOpen={handleOpen}
                onClick={handleClick}
                onPreview={handlePreview}
                onRename={handleRename}
                onEdit={handleFolderEdit}
                onDetails={handleDetails}
                onPageSizeChange={openedDirectoryId ? handleFilePageSizeChange : handleFolderPageSizeChange}
                onPaginationChange={openedDirectoryId ? handleFilePaginationChange : handleFolderPaginationChange}
              />
            </>
          )}
        </div>
      </div>
      {previewInfo?.documentBlob && (
        <DocumentPreviewEnhanced
          documentBlob={previewInfo.documentBlob}
          fileName={previewInfo.fileName}
          onClose={handleClosePreview}
          viewerType={previewInfo.viewerType}
          previewUrl={previewInfo.objectUrl}
        />
      )}
      <FileDetails onShare={handleShare} />
      <FolderEdit />
      <FileManagerDeleteDialog />
      <FileManagerInviteDialog />
      <FileManagerRenameDialog />
    </>
  )
}

export default FolderManager


