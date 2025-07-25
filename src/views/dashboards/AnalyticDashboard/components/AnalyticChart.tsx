// import { useEffect, useRef } from 'react'
// import Card from '@/components/ui/Card'
// import Chart from '@/components/shared/Chart'
// import GrowShrinkValue from '@/components/shared/GrowShrinkValue'
// import { COLORS } from '@/constants/chart.constant'
// import { useThemeStore } from '@/store/themeStore'
// import { NumericFormat } from 'react-number-format'
// import type { WebAnalyticData } from '../types'

// type WebAnalyticProps = {
//     data: WebAnalyticData
// }

// const WebAnalytic = ({ data }: WebAnalyticProps) => {
//     const isFirstRender = useRef(true)

//     const sideNavCollapse = useThemeStore(
//         (state) => state.layout.sideNavCollapse,
//     )

//     useEffect(() => {
//         if (!sideNavCollapse && isFirstRender.current) {
//             isFirstRender.current = false
//             return
//         }

//         if (!isFirstRender.current) {
//             window.dispatchEvent(new Event('resize'))
//         }
//     }, [sideNavCollapse])

//     return (
//         <Card className="h-full">
//             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                 <h4>Web analytic</h4>
//                 <div className="inline-flex items-center gap-6">
//                     <div className="flex items-center gap-1.5">
//                         <div
//                             className="h-3.5 w-3.5 rounded"
//                             style={{ backgroundColor: COLORS[0] }}
//                         />
//                         <div>Natural</div>
//                     </div>
//                     <div className="flex items-center gap-1.5">
//                         <div
//                             className="h-3.5 w-3.5 rounded"
//                             style={{ backgroundColor: COLORS[7] }}
//                         />
//                         <div>Referral</div>
//                     </div>
//                     <div className="flex items-center gap-1.5">
//                         <div
//                             className="h-3.5 w-3.5 rounded"
//                             style={{ backgroundColor: COLORS[8] }}
//                         />
//                         <div>Direct</div>
//                     </div>
//                 </div>
//             </div>
//             <div className="mt-8">
//                 <div className="flex items-center gap-10">
//                     <div>
//                         <div className="mb-2">Page views</div>
//                         <div className="flex items-end gap-2">
//                             <h3>
//                                 <NumericFormat
//                                     displayType="text"
//                                     value={data.pageView.value}
//                                     prefix={'$'}
//                                     thousandSeparator={true}
//                                 />
//                             </h3>
//                             <GrowShrinkValue
//                                 className="font-bold"
//                                 value={data.pageView.growShrink}
//                                 suffix="%"
//                                 positiveIcon="+"
//                                 negativeIcon=""
//                             />
//                         </div>
//                     </div>
//                     <div>
//                         <div className="mb-2">Avg. Time on page</div>
//                         <div className="flex items-end gap-2">
//                             <h3>{data.avgTimeOnPage.value}</h3>
//                             <GrowShrinkValue
//                                 className="font-bold"
//                                 value={data.avgTimeOnPage.growShrink}
//                                 suffix="%"
//                                 positiveIcon="+"
//                                 negativeIcon=""
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div className="mt-4">
//                 <Chart
//                     type="line"
//                     series={data.series}
//                     xAxis={data.date}
//                     height="330px"
//                     customOptions={{
//                         legend: { show: false },
//                         colors: [COLORS[0], COLORS[7], COLORS[8]],
//                     }}
//                 />
//             </div>
//         </Card>
//     )
// }

// export default WebAnalytic

import { useEffect, useMemo, useRef } from 'react'
import Card from '@/components/ui/Card'
import Chart from '@/components/shared/Chart'
// import GrowShrinkValue from '@/components/shared/GrowShrinkValue'
// import { NumericFormat } from 'react-number-format'
import { COLORS } from '@/constants/chart.constant'
import { useThemeStore } from '@/store/themeStore'
// import type { WebAnalyticData } from '../types'
 // Add to your types file
export type DocumentCountData = {
    count: number
    category: string
}[]

type WebAnalyticProps = {
    data: DocumentCountData  
}

const WebAnalytic = ({ data  }: WebAnalyticProps) => {
    const isFirstRender = useRef(true)

    const sideNavCollapse = useThemeStore(
        (state) => state.layout.sideNavCollapse,
    )

    useEffect(() => {
        if (!sideNavCollapse && isFirstRender.current) {
            isFirstRender.current = false
            return
        }

        if (!isFirstRender.current) {
            window.dispatchEvent(new Event('resize'))
        }
    }, [sideNavCollapse])
    
  const { series, labels } = useMemo(() => {
        const categories = data || []
        return {
            series: [{ name: 'Count', data: categories.map((item) => item.count) }],
            labels: categories.map((item) => item.category),
        }
    }, [data])
 

    return (
        <Card className="h-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h4>Web analytic</h4>
                <div className="inline-flex items-center gap-6">
                    <div className="flex items-center gap-1.5">
                        <div
                            className="h-3.5 w-3.5 rounded"
                            style={{ backgroundColor: COLORS[0] }}
                        />
                        <div>Natural</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div
                            className="h-3.5 w-3.5 rounded"
                            style={{ backgroundColor: COLORS[7] }}
                        />
                        <div>Referral</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div
                            className="h-3.5 w-3.5 rounded"
                            style={{ backgroundColor: COLORS[8] }}
                        />
                        <div>Direct</div>
                    </div>
                </div>
            </div>
            
            <div className="mt-4">
                <Chart
                    type="bar"
                    series={series}
                    xAxis={labels}
                    height="330px"
                    customOptions={{
                        legend: { show: false },
                        colors: [COLORS[0], COLORS[7], COLORS[8]],
                    }}
                />
            </div>
            
        </Card>
    )
}

export default WebAnalytic
