import dashboardsRoute from './dashboardsRoute'
import conceptsRoute from './conceptsRoute'
import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes: Routes = [
    ...dashboardsRoute,
    ...conceptsRoute,
]
