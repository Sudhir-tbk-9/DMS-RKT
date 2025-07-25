import classNames from 'classnames'
import Header from './Header'
import { isMonthInRange, getMonthsNames, formatYear } from '../utils'
import type { CommonProps } from '../../@types/common'

export interface MonthTableProps extends CommonProps {
    value: { year: number; month: number }
    onChange: (value: number) => void
    year: number
    onYearChange: (year: number) => void
    onNextLevel?: () => void
    minDate?: Date
    maxDate?: Date
    monthLabelFormat?: string
    yearLabelFormat?: string
    preventFocus?: boolean
}

const MonthTable = (props: MonthTableProps) => {
    const {
        className,
        value,
        onChange,
        year,
        onYearChange,
        onNextLevel,
        minDate,
        maxDate,
        preventFocus,
        monthLabelFormat = 'MMM',
        yearLabelFormat = 'YYYY',
        ...rest
    } = props

    const range = getMonthsNames( monthLabelFormat)
    const minYear = minDate instanceof Date ? minDate.getFullYear() : undefined
    const maxYear = maxDate instanceof Date ? maxDate.getFullYear() : undefined

    const months = range.map((month, index) => {
        const disabled = !isMonthInRange({
            date: new Date(year, index),
            minDate,
            maxDate,
        })

        const active = index === value.month && year === value.year

        return (
            <button
                key={month}
                className={classNames(
                    'month-picker-cell',
                    active && !disabled
                        ? 'month-picker-cell-active bg-primary'
                        : 'text-gray-800 dark:text-gray-100',
                    !active && !disabled && 'hover:bg-gray-100',
                    disabled && 'month-picker-cell-disabled',
                )}
                disabled={disabled}
                type="button"
                onClick={() => onChange(index)}
                onMouseDown={(event) => preventFocus && event.preventDefault()}
            >
                {month}
            </button>
        )
    })

    return (
        <div className={classNames('month-picker', className)} {...rest}>
            <Header
                label={formatYear(year, yearLabelFormat)}
                hasNext={typeof maxYear === 'number' ? year < maxYear : true}
                hasPrevious={
                    typeof minYear === 'number' ? year > minYear : true
                }
                className={className}
                nextLabel={'Next year'}
                previousLabel={'Previous year'}
                preventFocus={preventFocus}
                onNext={() => onYearChange(year + 1)}
                onPrevious={() => onYearChange(year - 1)}
                onNextLevel={onNextLevel}
            />
            <div className="month-table">{months}</div>
        </div>
    )
}

export default MonthTable
