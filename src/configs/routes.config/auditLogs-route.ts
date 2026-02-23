
import { lazy } from "react"
import { CONCEPTS_PREFIX_PATH } from "@/constants/route.constant"
import { ADMIN } from "@/constants/roles.constant"
import type { Routes } from "@/@types/routes"

const auditLogsRoute: Routes = [
  {
    key: "concepts.auditLogs.list",
    path: `${CONCEPTS_PREFIX_PATH}/logs`,
    component: lazy(() => import("@/views/concepts/auditLogs/AuditLogsList/AuditLogsList")),
    authority: [ADMIN], 
    meta: {
      header: {
        title: "Audit Logs",
        description: "Track and manage system audit logs.",
        contained: true,
      },
      pageContainerType: "contained",
      pageBackgroundType: "plain",
    },
  }
]

export default auditLogsRoute
