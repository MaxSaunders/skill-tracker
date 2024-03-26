import { ReactNode, createContext, useCallback, useMemo } from "react"
import { useToast } from "./use-toast"
import { Toaster } from "./toaster"

interface ProviderProps {
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
    const { toast } = useToast()

    const addPageError = useCallback((newError: PageError) => {
        toast({
            title: 'ERROR: ' + (newError.code ?? 500),
            description: newError.message,
            duration: 7000,
            variant: 'destructive',
            className: 'mb-2'
        })
    }, [toast])

    const contextValues = useMemo(() => {
        return { addPageError }
    }, [addPageError])

    return (
        <PageErrorsContext.Provider value={contextValues}>
            {children}
            <Toaster />
        </PageErrorsContext.Provider>
    )
}