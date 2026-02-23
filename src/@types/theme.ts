/*
 *   Copyright (c) 2025 
 *   All rights reserved.
 */
 export type Mode = 'light' | 'dark'
 export type ControlSize = 'lg' | 'md' | 'sm'
export type LayoutType =
    | 'blank'
    | 'collapsibleSide'
    | 'framelessSide'

 export type Theme = {
    themeSchema: string
    mode: Mode
  panelExpand: boolean
    layout: {
         type: LayoutType
         sideNavCollapse: boolean
       previousType?: LayoutType | ''
   }
 }
