import classNames from 'classnames'
import type { ComponentType, FC } from 'react'

export type WithHeaderItemProps = {
    className?: string
    hoverable?: boolean
}

const withHeaderItem = <T extends WithHeaderItemProps>(
    Component: ComponentType<Omit<T, keyof WithHeaderItemProps>>,
): FC<T> => {
    const WithHeaderItem: FC<T> = (props: T) => {
        const { className, hoverable = true } = props
        return (
            <Component
                {...(props as Omit<T, keyof WithHeaderItemProps>)}
                className={classNames(
                    'header-action-item',
                    hoverable && 'header-action-item-hoverable',
                    className,
                )}
            />
        )
    }
    WithHeaderItem.displayName = `withHeaderItem(${
        Component.displayName || Component.name || 'Component'
    })`
    return WithHeaderItem
}

export default withHeaderItem
//You can apply the same styling and behavior to multiple components without duplicating code.
//All header items will have consistent styling and behavior.
//You can still pass additional className or override hoverable as needed.
