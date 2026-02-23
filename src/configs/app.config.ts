/*
 *   Copyright (c) 2025 
 *   All rights reserved.
 */
export type AppConfig = {
  apiPrefix: string
  baseUrl: string
  authenticatedEntryPath: string
  unAuthenticatedEntryPath: string
  locale: string
  accessTokenPersistStrategy: "localStorage" | "sessionStorage" | "cookies"
  enableMock: boolean
}

const appConfig: AppConfig = {
  apiPrefix: "/api",

  baseUrl: "http://192.168.0.224:8082", // Local
  //baseUrl: 'http://192.168.0.28:8050/dms',  // DV
  // baseUrl: 'http://192.168.0.47:8008/dms',  // PY
  authenticatedEntryPath: "/dashboards/analytic",
  unAuthenticatedEntryPath: "/sign-in",
  locale: "en",
  accessTokenPersistStrategy: "localStorage",
  enableMock: true,
}

export default appConfig

