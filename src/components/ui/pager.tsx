import {
    Pagination,
    PaginationContent,
    // PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { useCallback } from "react";

type stateFunction = (i: number) => void

interface PagerProps {
    current: number;
    size?: number;
    setPage: (page: number) => void | ((fn: stateFunction) => void);
    totalPages?: number;
    resultsCount?: number
}

const Pager: React.FC<PagerProps> = ({ current, size = 5, setPage, totalPages, resultsCount }) => {
    if (current == null || current == undefined) {
        throw Error("Pager component requires current value")
    }

    const first = (current < (size / 2)) ? 0 : Math.ceil(current - (size / 2))
    const pageArray = []
    for (let i = first; i < (first + size); i++) {
        if (totalPages == 0) {
            pageArray.push(0)
            break
        }
        if (totalPages && (i + 1) > totalPages) {
            break
        }
        pageArray.push(i)
    }

    const setPrev = useCallback(() => {
        if (current > 0) {
            setPage(current - 1)
        }
    }, [current, setPage])

    const setNext = useCallback(() => {
        if (totalPages == null || totalPages == undefined || (current + 1) < totalPages) {
            setPage(current + 1)
        }
    }, [current, setPage, totalPages])

    return (
        <Pagination className='mt-5 text-white'>
            <PaginationContent className='w-full grid grid-cols-3'>
                <div />
                <div className='grid grid-cols-3'>
                    {current > 0 ? (
                        <PaginationItem className='flex justify-end' onClick={setPrev}>
                            <PaginationPrevious className={`${current <= 0 ? 'cursor-default text-transparent hover:bg-prime bg-prime hover:text-transparent' : 'cursor-pointer'}`} />
                        </PaginationItem>
                    ) : (
                        <PaginationItem />
                    )}
                    <div className='flex justify-center'>
                        {pageArray.map(page =>
                            <PaginationItem className={`${page === current && 'hover:bg-transparent'} cursor-pointer`} key={page} onClick={() => setPage(page)}>
                                <PaginationLink className={`${(page == current) ? 'border border-input' : ''}}`}>
                                    {page + 1}
                                </PaginationLink>
                            </PaginationItem>
                        )}
                    </div>
                    {totalPages && ((current + 1) < totalPages) ? (
                        <PaginationItem className='flex justify-start' onClick={setNext}>
                            <PaginationNext className={`${(totalPages != undefined) && (current + 1) >= totalPages ? 'cursor-default text-transparent hover:bg-prime bg-prime hover:text-transparent' : 'cursor-pointer'}`} />
                        </PaginationItem>
                    ) : (
                        <PaginationItem />
                    )}
                </div>
                {(resultsCount !== undefined && resultsCount !== null) && (
                    <PaginationItem className='text-white text-right'>
                        <span>
                            Showing&nbsp;
                        </span>
                        <span className=' font-bold'>
                            {resultsCount}&nbsp;
                        </span>
                        <span>
                            Results
                        </span>
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    )
}

export default Pager
