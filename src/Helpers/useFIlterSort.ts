import { useCallback, useState } from "react"

interface FilterSortInitialState<T> {
    sort?: keyof T,
    filter?: string,
    isAsc?: boolean
}

interface FilterSortType {
    [index: string]: string | number
}

const useFilterSort = <T extends FilterSortType>(initialState?: FilterSortInitialState<T>) => {
    const [sort, setSort] = useState<keyof T | null>(initialState?.sort ?? null)
    const [isAsc, setIsAsc] = useState<boolean>(initialState?.isAsc || true)
    const [filter, setFilter] = useState<string>(initialState?.filter ?? '')

    const changeSort = useCallback((field: keyof T, startAsc: boolean = true) => {
        if (sort == field && isAsc) {
            setIsAsc(false)
        } else if (sort == field) {
            setIsAsc(true)
        } else {
            setSort(field)
            setIsAsc(startAsc)
        }
    }, [isAsc, sort])

    const sortFunction = useCallback((a: T, b: T) => {
        if (sort) {
            return (a[sort] > b[sort] ? -1 : 1) * (isAsc ? 1 : -1)
        }
        return 0
    }, [isAsc, sort])

    const filterFunction = useCallback((field: keyof T) => (a: T) => {
        const value = a[field]
        if (typeof value == 'string') {
            return value.toLowerCase().includes(filter.toLowerCase())
        }
        if (typeof value == 'number') {
            return value.toString().includes(filter)
        }
        return true
    }, [filter])
    
    return {
        sort,
        filter,
        isAsc,
        setSort,
        setFilter,
        setIsAsc,
        changeSort,
        filterFunction,
        sortFunction
    }
}

export default useFilterSort