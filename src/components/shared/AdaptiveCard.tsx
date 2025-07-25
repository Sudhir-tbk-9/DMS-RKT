//Ye component Card component ko extend karta hai aur layout ke hisab se card ke styling aur behavior ko adapt (adjust) kar sakta hai.
//  Iska use karke aap cards ko dynamic aur responsive banane ke liye kiya ja sakta hai.

import classNames from '@/utils/classNames'
import Card from '@/components/ui/Card'
import useLayout from '@/utils/hooks/useLayout'
import type { CardProps } from '@/components/ui/Card'

type AdaptableCardProps = CardProps

const AdaptiveCard = (props: AdaptableCardProps) => {
    const { adaptiveCardActive } = useLayout()

    const { className, bodyClass, ...rest } = props

    return (
        <Card
            className={classNames(
                className,
                adaptiveCardActive && 'border-none dark:bg-transparent',
            )}
            bodyClass={classNames(bodyClass, adaptiveCardActive && 'p-0')}
            {...rest}
        />
    )
}

export default AdaptiveCard
