import { useCallback, useState } from "react"

import { peopleDB, user } from ".."
import { Person } from "../../Types/Person"

const usePeopleApi = () => {
    const [sessionUser, setSessionUser] = useState<Person>()
    const [resultsAll, setResultsAll] = useState<Person[]>([])
    const [resultsSingle, setResultsSingle] = useState<Person>()
    const [loading, setLoading] = useState(false)

    const apiCall = useCallback((searchIdString: string = '') => {
        return new Promise<Person[]>((resolve, reject) => {
            try {
                const people = peopleDB.list()

                if (searchIdString) {
                    const r = people.filter(i => i.id === searchIdString)
                    resolve(r)
                } else {
                    resolve(people)
                }
            } catch (error) {
                reject(error)
            }
        })
    }, [])

    const fetchAll = useCallback(() => {
        setLoading(true)

        apiCall().then((data) => {
            setResultsAll(data)
            setLoading(false)
        })

    }, [apiCall])

    const fetch = useCallback((searchId: string = '') => {
        setLoading(true)

        apiCall(searchId).then((data) => {
            setResultsSingle(data[0])
            setLoading(false)
        })

        setLoading(false)
    }, [apiCall])

    const sessionApiCall = useCallback(() => {
        return new Promise<Person>((resolve, reject) => {
            try {
                const loggedInUser = user.list()[0]
                resolve(loggedInUser)
            } catch (error) {
                reject(error)
            }
        })
    }, [])

    const fetchSessionUser = useCallback(() => {
        setLoading(true)
        sessionApiCall().then((data) => {
            setSessionUser(data)
            setLoading(false)
        })
    }, [sessionApiCall])

    return {
        loading,
        resultsAll,
        resultsSingle,
        sessionUser,
        fetchAll,
        fetch,
        fetchSessionUser
    }
}

export default usePeopleApi
