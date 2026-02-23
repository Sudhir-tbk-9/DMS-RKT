/*
 *   Copyright (c) 2025 
 *   All rights reserved.
 */
import type { LazyExoticComponent } from 'react'

export type DocRouteNav = {
    path: string
    label: string
    component: LazyExoticComponent<() => JSX.Element>
}

export type DocumentationRoute = {
    groupName: string
    nav: DocRouteNav[]
}
