import ApiService from "./ApiService"
import type {
  CreateNextNumberingRequest,
  UpdateNextNumberingRequest,
  NextNumberingResponse,
} from "@/@types/next-numbering"

// Check if your backend API requires a prefix like '/dms' or '/api'
// Based on your app.config comments, you might need '/dms'
const API_PREFIX = "/doc" // Adjust this if needed

export async function apiGetAllNextNumbering(): Promise<NextNumberingResponse> {
  const url = `${API_PREFIX}/numbers`
  console.log("API Call - GET All Numbering Sequences")
  console.log(" URL:", url)

  try {
    const response = await ApiService.backendApiWithAxios<NextNumberingResponse>({
      url,
      method: "get",
    })
    console.log("📥 Response:", response)
    return response
  } catch (error) {
    console.error("❌ API Error:", error)
    throw error
  }
}

export async function apiGetNextNumberingById(id: number): Promise<NextNumberingResponse> {
  const url = `${API_PREFIX}/number/${id}`
  console.log(" API Call - GET Numbering Sequence by ID")
  console.log(" URL:", url)
  console.log("ID:", id)

  try {
    const response = await ApiService.backendApiWithAxios<NextNumberingResponse>({
      url,
      method: "get",
    })
    console.log(" Response:", response)
    return response
  } catch (error) {
    console.error(" API Error:", error)
    throw error
  }
}

export async function apiGetNextNumberingByDocId(docId: string): Promise<NextNumberingResponse> {
  const url = `${API_PREFIX}/find?docId=${docId}`
  console.log(" API Call - GET Numbering Sequence by Doc ID")
  console.log(" URL:", url)
  console.log(" Doc ID:", docId)

  try {
    const response = await ApiService.backendApiWithAxios<NextNumberingResponse>({
      url,
      method: "get",
    })
    console.log("📥 Response:", response)
    return response
  } catch (error) {
    console.error("❌ API Error:", error)
    throw error
  }
}

export async function apiCreateNextNumbering(data: CreateNextNumberingRequest): Promise<NextNumberingResponse> {
  const url = `${API_PREFIX}/number`
  console.log("🌐 API Call - CREATE Numbering Sequence")
  console.log("📍 URL:", url)
  console.log("📤 Payload:", JSON.stringify(data, null, 2))

  try {
    const response = await ApiService.backendApiWithAxios<NextNumberingResponse>({
      url,
      method: "post",
      data,
    })
    console.log("📥 Response:", response)
    return response
  } catch (error) {
    console.error("❌ API Error:", error)
    throw error
  }
}

export async function apiUpdateNextNumbering(
  id: number,
  data: UpdateNextNumberingRequest,
): Promise<NextNumberingResponse> {
  const url = `${API_PREFIX}/number/${id}`
  console.log("🌐 API Call - UPDATE Numbering Sequence")
  console.log("📍 URL:", url)
  console.log("🆔 ID:", id)
  console.log("📤 Payload:", JSON.stringify(data, null, 2))

  try {
    const response = await ApiService.backendApiWithAxios<NextNumberingResponse>({
      url,
      method: "put",
      data,
    })
    console.log("📥 Response:", response)
    return response
  } catch (error) {
    console.error("❌ API Error:", error)
    throw error
  }
}

export async function apiUpdateNextNumberingIndex(id: number): Promise<NextNumberingResponse> {
  const url = `${API_PREFIX}/number/updateindex/${id}`
  console.log("🌐 API Call - UPDATE Numbering Index")
  console.log("📍 URL:", url)
  console.log("🆔 ID:", id)

  try {
    const response = await ApiService.backendApiWithAxios<NextNumberingResponse>({
      url,
      method: "put",
    })
    console.log("📥 Response:", response)
    return response
  } catch (error) {
    console.error("❌ API Error:", error)
    throw error
  }
}

export async function apiDeleteNextNumbering(id: number): Promise<NextNumberingResponse> {
  const url = `${API_PREFIX}/number/${id}`
  console.log("🌐 API Call - DELETE Numbering Sequence")
  console.log("📍 URL:", url)
  console.log("🆔 ID:", id)

  try {
    const response = await ApiService.backendApiWithAxios<NextNumberingResponse>({
      url,
      method: "delete",
    })
    console.log("📥 Response:", response)
    return response
  } catch (error) {
    console.error("❌ API Error:", error)
    throw error
  }
}


