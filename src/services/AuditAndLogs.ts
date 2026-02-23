import ApiService from "./ApiService"

export interface AuditLogEntry {
  id: number
  eventTime: string
  actorId: number | null
  actorEmail: string
  action: string
  category: string
  entityType: string
  requestId: string
  httpMethod: string
  ipAddress: string
  ipNormalized: string
  userAgent: string
  success: boolean
  latencyMs: number
}

export interface AuditLogsPage {
  size: number
  number: number
  totalElements: number
  totalPages: number
}

export interface AuditLogsResponse {
  content: AuditLogEntry[]
  page: AuditLogsPage
}

const API_PREFIX = "/admin/audits"

export async function apiGetAllAuditLogs(
  page: number = 0,
  size: number = 20
): Promise<AuditLogsResponse> {
  const url = `${API_PREFIX}?page=${page}&size=${size}`
  console.log("API Call - GET All Audit Logs")
  console.log(" URL:", url)
  console.log(" Page:", page)
  console.log(" Size:", size)

  try {
    const response = await ApiService.backendApiWithAxios<AuditLogsResponse>({
      url,
      method: "get",
    })
    console.log(" Response:", response)
    return response
  } catch (error: any) {
    console.error(" API Error:", error)
    let errorMessage = 'Failed to load audit logs'
    if (error?.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error?.message) {
      errorMessage = error.message
    }
    throw new Error(errorMessage)
  }
}

export async function apiGetAuditLogById(id: number): Promise<AuditLogEntry> {
  const url = `${API_PREFIX}/${id}`
  console.log(" API Call - GET Audit Log by ID")
  console.log(" URL:", url)
  console.log(" ID:", id)

  try {
    const response = await ApiService.backendApiWithAxios<AuditLogEntry>({
      url,
      method: "get",
    })
    console.log(" Response:", response)
    return response
  } catch (error: any) {
    console.error(" API Error:", error)
    let errorMessage = `Failed to load audit log with ID: ${id}`
    if (error?.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error?.message) {
      errorMessage = error.message
    }
    throw new Error(errorMessage)
  }
}

export async function apiSearchAuditLogs(
  filters: {
    actorEmail?: string
    action?: string
    category?: string
    entityType?: string
    success?: boolean
    startDate?: string
    endDate?: string
  },
  page: number = 0,
  size: number = 20
): Promise<AuditLogsResponse> {
  const params = new URLSearchParams()
  
  if (filters.actorEmail) params.append('actorEmail', filters.actorEmail)
  if (filters.action) params.append('action', filters.action)
  if (filters.category) params.append('category', filters.category)
  if (filters.entityType) params.append('entityType', filters.entityType)
  if (filters.success !== undefined) params.append('success', filters.success.toString())
  if (filters.startDate) params.append('startDate', filters.startDate)
  if (filters.endDate) params.append('endDate', filters.endDate)
  
  params.append('page', page.toString())
  params.append('size', size.toString())
  
  const url = `${API_PREFIX}/search?${params.toString()}`
  console.log(" API Call - SEARCH Audit Logs")
  console.log(" URL:", url)
  console.log(" Filters:", filters)

  try {
    const response = await ApiService.backendApiWithAxios<AuditLogsResponse>({
      url,
      method: "get",
    })
    console.log(" Response:", response)
    return response
  } catch (error: any) {
    console.error(" API Error:", error)
    
    // If search endpoint doesn't exist, fall back to getAll and filter client-side
    if (error?.response?.status === 404) {
      console.log("Search endpoint not found, falling back to client-side filtering")
      return handleClientSideSearch(filters, page, size)
    }
    
    let errorMessage = 'Failed to search audit logs'
    if (error?.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error?.message) {
      errorMessage = error.message
    }
    throw new Error(errorMessage)
  }
}

// Fallback for client-side filtering if search endpoint is not available
async function handleClientSideSearch(
  filters: {
    actorEmail?: string
    action?: string
    category?: string
    entityType?: string
    success?: boolean
    startDate?: string
    endDate?: string
  },
  page: number = 0,
  size: number = 20
): Promise<AuditLogsResponse> {
  try {
    // Get all logs first
    const allLogs = await apiGetAllAuditLogs(0, 1000) // Get a large number for filtering
    
    let filteredLogs = [...allLogs.content]
    
    // Apply filters
    if (filters.actorEmail) {
      filteredLogs = filteredLogs.filter(log => 
        log.actorEmail.toLowerCase().includes(filters.actorEmail!.toLowerCase())
      )
    }
    
    if (filters.action) {
      filteredLogs = filteredLogs.filter(log => 
        log.action.toLowerCase().includes(filters.action!.toLowerCase())
      )
    }
    
    if (filters.category) {
      filteredLogs = filteredLogs.filter(log => log.category === filters.category)
    }
    
    if (filters.entityType) {
      filteredLogs = filteredLogs.filter(log => log.entityType === filters.entityType)
    }
    
    if (filters.success !== undefined) {
      filteredLogs = filteredLogs.filter(log => log.success === filters.success)
    }
    
    if (filters.startDate) {
      const startDate = new Date(filters.startDate)
      filteredLogs = filteredLogs.filter(log => new Date(log.eventTime) >= startDate)
    }
    
    if (filters.endDate) {
      const endDate = new Date(filters.endDate)
      endDate.setHours(23, 59, 59, 999) // End of day
      filteredLogs = filteredLogs.filter(log => new Date(log.eventTime) <= endDate)
    }
    
    // Apply pagination
    const totalElements = filteredLogs.length
    const totalPages = Math.ceil(totalElements / size)
    const startIndex = page * size
    const paginatedLogs = filteredLogs.slice(startIndex, startIndex + size)
    
    return {
      content: paginatedLogs,
      page: {
        size,
        number: page,
        totalElements,
        totalPages
      }
    }
  } catch (error) {
    console.error("Client-side search error:", error)
    throw error
  }
}

export async function apiGetAuditLogsByActor(actorId: number): Promise<AuditLogEntry[]> {
  const url = `${API_PREFIX}/actor/${actorId}`
  console.log(" API Call - GET Audit Logs by Actor ID")
  console.log(" URL:", url)
  console.log(" Actor ID:", actorId)

  try {
    const response = await ApiService.backendApiWithAxios<AuditLogEntry[]>({
      url,
      method: "get",
    })
    console.log(" Response:", response)
    return response
  } catch (error: any) {
    console.error(" API Error:", error)
    let errorMessage = `Failed to load audit logs for actor ID: ${actorId}`
    if (error?.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error?.message) {
      errorMessage = error.message
    }
    throw new Error(errorMessage)
  }
}
