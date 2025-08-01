import classNames from 'classnames'
import dayjs from 'dayjs'
import { isMonthInRange } from '../utils/isMonthInRange'
import Header from './Header'
import Month from './components/Month'
import capitalize from '../../utils/capitalize'
import type { CommonProps } from '../../@types/common'
import type { MonthBaseProps } from './components/Month'
import type { DayKeydownPayload } from './components/types'
import type { RefObject } from 'react'

export interface DateTableProps extends CommonProps, MonthBaseProps {
    dateViewCount: number
    paginateBy: number
    enableHeaderLabel: boolean
    daysRefs: RefObject<HTMLButtonElement[][][]>
    onMonthChange: (month: Date) => void
    onNextLevel: (unit: 'month' | 'year') => void
    onDayKeyDown: (
        monthIndex: number,
        payload: DayKeydownPayload,
        event: React.KeyboardEvent<HTMLButtonElement>,
    ) => void
    labelFormat?: { month: string; year: string }
    weekdayLabelFormat?: string
    onChange?: (value: Date) => void
    onDayMouseEnter?: (date: Date, event: React.MouseEvent) => void
    preventFocus?: boolean
    renderDay?: (date: Date) => React.ReactNode
    range?: [Date, Date]
}

function formatMonthLabel({
    month,
    format,
}: {
    month: Date
    format: string
}) {
    return capitalize(dayjs(month).format(format))
}

const DateTable = (props: DateTableProps) => {
    const {
        dateViewCount,
        paginateBy,
        month,
        minDate,
        maxDate,
        enableHeaderLabel,
        daysRefs,
        onMonthChange,
        onNextLevel,
        onDayKeyDown,
        className,
        labelFormat,
        weekdayLabelFormat,
        preventFocus,
        renderDay,
        ...rest
    } = props

    const nextMonth = dayjs(month).add(dateViewCount, 'months').toDate()
    const previousMonth = dayjs(month).subtract(1, 'months').toDate()

    const pickerHeaderLabelClass = 'picker-header-label hover:text-primary'

    const months = Array(dateViewCount)
        .fill(0)
        .map((_, index) => {
            const monthDate = dayjs(month).add(index, 'months').toDate()
            return (
                <div key={index} className="day-picker">
                    <Header
                        hasNext={
                            index + 1 === dateViewCount &&
                            isMonthInRange({
                                date: nextMonth,
                                minDate,
                                maxDate,
                            })
                        }
                        hasPrevious={
                            index === 0 &&
                            isMonthInRange({
                                date: previousMonth,
                                minDate,
                                maxDate,
                            })
                        }
                        className={className}
                        onNext={() =>
                            onMonthChange(
                                dayjs(month).add(paginateBy, 'months').toDate(),
                            )
                        }
                        onPrevious={() =>
                            onMonthChange(
                                dayjs(month)
                                    .subtract(paginateBy, 'months')
                                    .toDate(),
                            )
                        }
                    >
                        <div>
                            <button
                                className={classNames(pickerHeaderLabelClass)}
                                disabled={!enableHeaderLabel}
                                tabIndex={index > 0 ? -1 : 0}
                                type="button"
                                onClick={() => onNextLevel('month')}
                                onMouseDown={(event) =>
                                    preventFocus && event.preventDefault()
                                }
                            >
                                {formatMonthLabel({
                                    month: monthDate,
                                    format: labelFormat?.month || 'MMM',
                                })}
                            </button>
                            <button
                                className={classNames(pickerHeaderLabelClass)}
                                disabled={!enableHeaderLabel}
                                tabIndex={index > 0 ? -1 : 0}
                                type="button"
                                onClick={() => onNextLevel('year')}
                                onMouseDown={(event) =>
                                    preventFocus && event.preventDefault()
                                }
                            >
                                {formatMonthLabel({
                                    month: monthDate,
                                    format: labelFormat?.year || 'YYYY',
                                })}
                            </button>
                        </div>
                    </Header>
                    <Month
                        month={monthDate}
                        daysRefs={
                            (daysRefs.current as HTMLButtonElement[][][])[index]
                        }
                        minDate={minDate}
                        maxDate={maxDate}
                        className={className}
                        focusable={index === 0}
                        preventFocus={preventFocus}
                        renderDay={renderDay}
                        weekdayLabelFormat={weekdayLabelFormat}
                        onDayKeyDown={(...args) => onDayKeyDown(index, ...args)}
                        {...rest}
                    />
                </div>
            )
        })

    return <>{months}</>
}

export default DateTable
