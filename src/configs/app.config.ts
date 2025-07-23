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

  baseUrl: "http://192.168.0.111:8081", // Local
  // baseUrl: 'http://192.168.0.47:8008/dms',  // PY
  // baseUrl: 'http://192.168.0.28:8050/dms',  // DV
  authenticatedEntryPath: "/dashboards/analytic",
  unAuthenticatedEntryPath: "/sign-in",
  locale: "en",
  accessTokenPersistStrategy: "localStorage",
  enableMock: true,
}

export default appConfig

