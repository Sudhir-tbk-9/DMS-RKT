import { forwardRef } from 'react'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { Input } from '../Input'
import useMergedRef from '../hooks/useMergeRef'
import { HiOutlineCalendar } from 'react-icons/hi'
import CloseButton from '../CloseButton'
import type { CommonProps, TypeAttributes } from '../@types/common'
import type {
    ReactNode,
    FocusEvent,
    HTMLInputTypeAttribute,
    KeyboardEvent,
    MouseEvent,
    ChangeEvent,
} from 'react'
import {
    useFloating,
    useInteractions,
    useDismiss,
    useRole,
    useFocus,
    useClick,
    useId,
    autoUpdate,
    offset,
    flip,
    shift,
} from '@floating-ui/react'

dayjs.extend(localizedFormat)

export interface BasePickerSharedProps {
    clearable?: boolean
    clearButton?: string | ReactNode
    disabled?: boolean
    inputtable?: boolean
    inputPrefix?: string | ReactNode
    inputSuffix?: string | ReactNode
    name?: string
    onBlur?: (event: FocusEvent<HTMLInputElement, Element>) => void
    onDropdownOpen?: () => void
    onDropdownClose?: () => void
    onFocus?: (event: FocusEvent<HTMLInputElement, Element>) => void
    placeholder?: string
    size?: TypeAttributes.ControlSize
    type?: HTMLInputTypeAttribute
}

interface BasePickerProps extends CommonProps, BasePickerSharedProps {
    dropdownOpened: boolean
    inputtableBlurClose?: boolean
    inputLabel?: string
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void
    onClear?: (event: MouseEvent<HTMLElement>) => void
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void
    setDropdownOpened: (opened: boolean) => void
}

const BasePicker = forwardRef<HTMLInputElement, BasePickerProps>(
    (props, ref) => {
        const {
            className,
            clearable = true,
            clearButton,
            children,
            disabled,
            dropdownOpened,
            inputtable,
            inputtableBlurClose = false,
            inputLabel,
            inputPrefix,
            inputSuffix = <HiOutlineCalendar className="text-lg" />,
            name,
            onDropdownOpen,
            onDropdownClose,
            onBlur,
            onFocus,
            onChange,
            onKeyDown,
            onClear,
            placeholder,
            setDropdownOpened,
            size,
            type,
        } = props

        const handleInputClick = () => {
            if (inputtable) {
                openDropdown();
            } else {
                toggleDropdown(!dropdownOpened);
            }
        };
        const closeDropdown = () => {
            setDropdownOpened(false);
            // Use `void` to explicitly indicate the result is unused
            void onDropdownClose?.();
        };
        const suffixIconSlot = clearable ? (
            clearButton ? (
                <div role="presentation" onClick={onClear}>
                    {clearButton}
                </div>
            ) : (
                <CloseButton className="text-base" onClick={onClear} />
            )
        ) : inputSuffix ? (
            <>{inputSuffix}</>
        ) : null

        const toggleDropdown = (open: boolean) => {
            setDropdownOpened(open);
            if (open) {
                // Use `void` to explicitly indicate the result is unused
                void onDropdownOpen?.();
            } else {
                // Use `void` to explicitly indicate the result is unused
                void onDropdownClose?.();
            }
        };

        const openDropdown = () => {
            setDropdownOpened(true);
            // Use `void` to explicitly indicate the result is unused
            void onDropdownOpen?.();
        };

        const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
            if (typeof onKeyDown === 'function') {
                onKeyDown(event);
            }
            if (
                (event.key === 'Space' || event.key === 'Enter') &&
                !inputtable
            ) {
                event.preventDefault();
                openDropdown();
            }
        };

        const handleInputBlur = (
            event: FocusEvent<HTMLInputElement, Element>,
        ) => {
            onBlur?.(event)
            if (inputtable && inputtableBlurClose) {
                closeDropdown()
            }
        }

        const handleInputFocus = (
            event: FocusEvent<HTMLInputElement, Element>,
        ) => {
            onFocus?.(event)
        }

        const { refs, floatingStyles, context } = useFloating({
            open: dropdownOpened,
            onOpenChange: toggleDropdown,
            placement: 'bottom-start',
            middleware: [
                offset(10),
                flip({
                    fallbackAxisSideDirection: 'start',
                }),
                shift(),
            ],
            whileElementsMounted: autoUpdate,
        })

        const focus = useFocus(context)
        const click = useClick(context)
        const dismiss = useDismiss(context)
        const role = useRole(context)

        const { getReferenceProps, getFloatingProps } = useInteractions([
            inputtable ? focus : click,
            dismiss,
            role,
        ])

        const headingId = useId()

        return (
            <>
                <Input
                    ref={useMergedRef(ref, refs.setReference)}
                    className={className}
                    placeholder={placeholder}
                    size={size}
                    name={name}
                    value={inputLabel}
                    readOnly={!inputtable}
                    suffix={suffixIconSlot}
                    prefix={inputPrefix}
                    autoComplete="off"
                    type={type}
                    disabled={disabled}
                    asElement={'input'}
                    onKeyDown={handleKeyDown}
                    onClick={handleInputClick}
                    onChange={onChange}
                    {...getReferenceProps({
                        onBlur: handleInputBlur,
                        onFocus: handleInputFocus,
                    })}
                />
                {dropdownOpened && (
                    <div
                        ref={refs.setFloating}
                        className="picker"
                        style={floatingStyles}
                        aria-labelledby={headingId}
                        {...getFloatingProps()}
                    >
                        <div className="picker-panel">{children}</div>
                    </div>
                )}
            </>
        )
    },
)

BasePicker.displayName = 'BasePicker'

export default BasePicker
