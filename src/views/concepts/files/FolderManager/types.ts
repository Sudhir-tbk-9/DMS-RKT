// ----------------------------
// TYPES
// ----------------------------
export type File = {
  activities: {
    actionType: string
    timestamp: number
    userName: string
    userImg: string
  }[]
  author: {
    email: string
    img: string
    name: string
  }
  categories: string[]
  category: string
  description: string
  documentNumber?: string // Added this field for files
  fileCategory: string | undefined
  fileType: string
  folder: string
  id: string
  name: string
  permissions: {
    role: string
    userName: string
    userImg: string
  }[]
  recent: boolean
  size: number
  srcUrl: string
  uploadDate: number
}

export type Category = { id: string; name: string }

export type FolderInfo = {
  categories: Category[]
  name: string
}

export type Folder = {
  id: string
  name: string
  fileType: "directory"
  description: string
  categories: Category[]
  fileCategory: string
  category: string
  srcUrl: string
  createdAt: string
  size: number
  filecategory: string
  folder: string
  uploadDate: string
  recentts: string
  code?: string // Added this field for folders (directory code)
}

export type DropdownItemCallbackProps = {
  id: string
  onOpen?: () => void
  onDownload?: () => void
  onShare?: () => void
  onRename?: () => void
  onDelete?: () => void
  onpreview?: () => void
  onDetails?: (id: string) => void
  onEdit?: () => void
}

export type Layout = "grid" | "list"

export type Files = Array<File | Folder>

export type Directories = { id: string; label: string }[]

// New generic type for paginated API responses
export type PaginatedApiResponse<T> = {
  message: string
  status: number
  data: {
    content: T[]
    page: {
      number: number
      size: number
      totalElements: number
      totalPages: number
    }
  }
  directory?: Directories // Optional, if it sometimes comes back at the top level
}

// Updated types to use PaginatedApiResponse
export type GetFoldersListResponse = PaginatedApiResponse<File | Folder> // Can contain both files and folders
export type GetFilesListResponse = PaginatedApiResponse<File> // Typically contains only files

export interface FilePreviewResponse {
  srcUrl: string
}

export type BaseFileItemProps = {
  id?: string
  name?: string
  fileType?: string
  size?: number
  category?: string
  loading?: boolean
  onClick?: () => void
  onPreview?: () => void | undefined
  onDetails?: (id: string) => void
} & DropdownItemCallbackProps

// ----------------------------
// LOG HELPERS
// ----------------------------

// Updated log functions to match new response types
export const logFoldersResponse = (res: GetFoldersListResponse) => {
  console.group("[📁 Folders List Response]")
  console.log("📦 Total Files:", res.data.page.totalElements)
  console.log("📄 Data Content:", res.data.content)
  console.log("📄 Pagination:", res.data.page)
  if (res.directory) console.log("🗂️ Directories:", res.directory)
  console.groupEnd()
}

export const logFilesResponse = (res: GetFilesListResponse) => {
  console.group("[📁 Files List Response]")
  console.log("📦 Total Items:", res.data.page.totalElements)
  console.log("📄 Content:", res.data.content)
  console.log("📄 Pagination:", res.data.page)
  if (res.directory) console.log("🗂️ Directories:", res.directory)
  console.groupEnd()
}

export const logPreviewResponse = (res: FilePreviewResponse) => {
  console.group("[👁️ File Preview Response]")
  console.log("🔗 Preview URL:", res.srcUrl)
  console.groupEnd()
}

export const logFileOrFolder = (item: File | Folder) => {
  console.group("[📝 File/Folder Selected]")
  console.log("🆔 ID:", item.id)
  console.log("📛 Name:", item.name)
  console.log("📁 Type:", item.fileType)
  console.log("📂 Category:", item.category)
  console.log("📦 Size:", item.size)
  if ("author" in item) console.log("👤 Author:", item.author)
  if ("activities" in item) console.log("📋 Activities:", item.activities)
  console.groupEnd()
}

export const logDropdownAction = (action: string, id?: string) => {
  console.log(`[⚙️ Dropdown Action] ${action}${id ? ` on ID: ${id}` : ""}`)
}
