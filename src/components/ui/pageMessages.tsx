import { ReactNode, createContext, useCallback, useMemo } from "react"
import { useToast } from "./use-toast"
import { Toaster } from "./toaster"

interface ProviderProps {
    addPageError: (newError: PageError) => void
    addPageMessage: (newMessage: PageMessage) => void
}

export const PageMessageContext = createContext<ProviderProps>({} as ProviderProps)

interface PageErrorsProps {
    children: ReactNode
}

type PageMessage = {
    id?: string
    message: string
    title?: string
}

type PageError = PageMessage & {
    code?: string | number
}

export const PageErrors: React.FC<PageErrorsProps> = ({ children }) => {
    const { toast } = useToast()

    const addPageError = useCallback(
        (newError: PageError) => {
            toast({
                title: (newError.title ?? "ERROR: ") + (newError.code ?? 500),
                description: newError.message,
                duration: 7000,
                variant: "destructive",
                className: "mb-2",
            })
        },
        [toast]
    )

    const addPageMessage = useCallback(
        (newMessage: PageMessage) => {
            toast({
                title: newMessage.title,
                description: newMessage.message,
                duration: 2000,
                className: "mb-2",
            })
        },
        [toast]
    )

    const contextValues = useMemo(() => {
        return { addPageError, addPageMessage }
    }, [addPageError, addPageMessage])

    return (
        <PageMessageContext.Provider value={contextValues}>
            {children}
            <Toaster />
        </PageMessageContext.Provider>
    )
}
