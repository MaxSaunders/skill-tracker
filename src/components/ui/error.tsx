import { ReactNode, createContext, useCallback, useMemo, useState } from "react"
import { v4 as gen_uuid } from 'uuid'
import { Button } from "./button"

interface ProviderProps {
    pageErrors: PageError[],
    addPageError: (newError: PageError) => void
}

export const PageErrorsContext = createContext<ProviderProps>({} as ProviderProps)

interface PageErrorsProps {
    children: ReactNode
}

type PageError = {
    id?: string,
    message: string,
    code?: string | number
}

export const PageErrors: React.FC<PageErrorsProps> = ({ children }) => {
    const [pageErrors, setPageErrors] = useState([] as PageError[])

    const addPageError = useCallback((newError: PageError) => {
        const id = gen_uuid()
        setPageErrors(currentErrors => [...currentErrors, { ...newError, id, code: newError.code ?? 500 }])
    }, [])

    const dismissPageError = useCallback((idToRemove?: string) => {
        if (idToRemove) {
            setPageErrors(currentErrors => currentErrors.filter(item => item.id !== idToRemove))
        }
    }, [])

    const contextValues = useMemo(() => {
        return { pageErrors, addPageError }
    }, [addPageError, pageErrors])

    return (
        <PageErrorsContext.Provider value={contextValues}>
            <div>
                {pageErrors.map(({ message, code, id }, index) =>
                    <div className='px-5 py-2 border-b border-gray-500 bg-red-400 flex justify-between' key={`${code}:${message}-${index}`}>
                        <span className='text-lg items-center flex'>
                            <span className='font-bold'>
                                {code}:&nbsp;
                            </span>
                            <span className='font-semibold'>
                                {message}
                            </span>
                        </span>
                        <span>
                            <Button className='py-0 bg-transparent border border-gray-500' onClick={() => dismissPageError(id)}>
                                X
                            </Button>
                        </span>
                    </div>
                )}
            </div>
            {children}
        </PageErrorsContext.Provider>
    )
}