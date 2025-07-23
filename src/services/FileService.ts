import ApiService from "./ApiService"
import type { GetFoldersListResponse, GetFilesListResponse } from "../views/concepts/files/FolderManager/types" // Ensure types are imported

//<+++++++++++++++++++++++++++++++++Api Get Files for taemp ++++++++++++++++++++++++++++++++++++++++>
export async function apiGetFiles<T, U extends Record<string, unknown>>(params: U) {
  return ApiService.fetchDataWithAxios<T>({
    url: "/api/files",
    method: "get",
    params,
  })
}

//<+++++++++++++++++++++++++++++++++Api Gets Folder ++++++++++++++++++++++++++++++++++++++++>
export async function apiGetFolders<U extends Record<string, unknown> & { page?: number; size?: number }>(
  params: U,
): Promise<GetFoldersListResponse> {
  // Apply default pagination values, but allow them to be overridden by params
  const baseParams = {
    page: params.page ?? 0, // Use params.page if provided, otherwise default to 0
    size: params.size ?? 10, // Use params.size if provided, otherwise default to 10
    ...params, // Spread other parameters
  }

  // Handle array parameters manually for proper serialization
  if (baseParams.ids && Array.isArray(baseParams.ids)) {
    const queryParams = baseParams.ids.map((id) => `ids=${id}`).join("&")
    const url = `/project-files?${queryParams}`

    // Remove ids from params to avoid double serialization
    const { ids, ...otherParams } = baseParams

    return ApiService.backendApiWithAxios<GetFoldersListResponse>({
      url,
      method: "get",
      params: otherParams, // Includes pagination and other params
    })
  }

  return ApiService.backendApiWithAxios<GetFoldersListResponse>({
    url: "/project-files",
    method: "get",
    params: baseParams, // Includes pagination params
  })
}

//<+++++++++++++++++++++++++++++++++Api Gets Files ++++++++++++++++++++++++++++++++++++++++>
export async function apiGetdoc<U extends Record<string, unknown>>(params: U): Promise<GetFilesListResponse> {
  return ApiService.backendApiWithAxios<GetFilesListResponse>({
    url: `/documents?`,
    method: "get",
    params: {
      ...params,
      folderId: params.id,
    },
  })
}

//<+++++++++++++++++++++++++++++++++Api Docments perview ++++++++++++++++++++++++++++++++++++++++>
export async function apiDocPreview<T, U extends Record<string, unknown>>(params: U) {
  return ApiService.backendApiWithAxios<T>({
    url: `/documents/download/${params.id}`,
    method: "get",
    params,
    responseType: "blob",
  })
}

//<+++++++++++++++++++++++++++++++++Api Create Folder ++++++++++++++++++++++++++++++++++++++++>
export async function apiCreateFolders<T, U extends Record<string, unknown>>(payload: U) {
  console.log("Payload to be sent to create folder : ", payload)

  return ApiService.backendApiWithAxios<T>({
    url: "/project-files", // API endpoint for creating folders
    method: "post",
    data: payload,
  })
}

//<+++++++++++++++++++++++++++++++++Api Update Category and other ++++++++++++++++++++++++++++++++++++++++>
export async function apiUpdateFolder<T, U extends Record<string, unknown>>(id: string, payload: U) {
  console.log("Sending:", { id, payload })
  return ApiService.backendApiWithAxios<T>({
    url: `/project-files?id=${id}`,
    method: "put",
    data: payload,
  })
}

//<+++++++++++++++++++++++++++++++++Api Delete Folder ++++++++++++++++++++++++++++++++++++++++>
export async function apiDeleteFolder<T>(folderId: string) {
  return ApiService.backendApiWithAxios<T>({
    url: `/project-files?id=${folderId}`, // API endpoint for deleting a folder
    method: "delete", // HTTP method
  })
}

//<+++++++++++++++++++++++++++++++++Api Delete Files ++++++++++++++++++++++++++++++++++++++++>
export async function apiDeleteFile<T>(fileId: string) {
  console.log("Deleting file with ID:", fileId) // Log the file ID being deleted
  return ApiService.backendApiWithAxios<T>({
    url: `/documents/${fileId}`,
    method: "delete",
  })
}

//<+++++++++++++++++++++++++++++++++ApiUploadFile ++++++++++++++++++++++++++++++++++++++++>
export async function apiUploadFile<T, U extends Record<string, unknown>>(file: File, documentDTO: U): Promise<T> {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("documentDTO", JSON.stringify(documentDTO))
  return ApiService.backendApiWithAxios<T>({
    url: "/documents/upload",
    method: "post",
    data: formData,
  })
}

//<+++++++++++++++++++++++++++++++++Api Rename Files ++++++++++++++++++++++++++++++++++++++++>
export async function apiRenameFile({
  id,
  newName,
  fileCategory,
}: {
  id: string
  newName: string
  fileCategory: string
}) {
  return ApiService.backendApiWithAxios<void>({
    url: `/documents/rename?documentId=${id}&newName=${encodeURIComponent(newName)}&fileCategory=${encodeURIComponent(fileCategory)}`,
    method: "put",
  })
}

