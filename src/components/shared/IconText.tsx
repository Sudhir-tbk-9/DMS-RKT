//Ek icon aur text jo ek saath display hote hain.
import classNames from '@/utils/classNames'
import type { CommonProps } from '@/@types/common'
import type { ReactNode, ElementType } from 'react'

export interface IconTextProps extends CommonProps {
    icon?: ReactNode | string
    asElement?: ElementType
}

const IconText = ({
    className,
    asElement: Component = 'span',
    icon,
    children,
}: IconTextProps) => {
    return (
        <Component className={classNames('flex items-center gap-2', className)}>
            {icon}
            {children}
        </Component>
    )
}

export default IconText
