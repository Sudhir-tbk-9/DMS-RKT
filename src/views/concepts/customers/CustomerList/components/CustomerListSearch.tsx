import { forwardRef } from 'react'
import DebouceInput from '@/components/shared/DebouceInput'
import { TbSearch } from 'react-icons/tb'

type CustomerListSearchProps = {
    onInputChange: (value: string) => void
}

const CustomerListSearch = forwardRef<
    HTMLInputElement,
    CustomerListSearchProps
>((props, ref) => {
    const { onInputChange } = props

    return (
        <DebouceInput
            ref={ref}
            placeholder="Quick search..."
            suffix={<TbSearch className="text-lg" />}
            
            onChange={(e) =>  {           
                   console.log("Search input changed:", e.target.value);
                onInputChange(e.target.value)}}
        />
    )
})

CustomerListSearch.displayName = 'CustomerListSearch'

export default CustomerListSearch
