import { useCallback, useState } from "react"
import axios, { AxiosError } from "axios"
import { ApiError, Person, UserSkill } from "@/Types"
import { useQuery } from "@tanstack/react-query"

const API_URL = import.meta.env.VITE_API_URL

export const useGetPeople = () => useQuery<Person[], AxiosError<ApiError>>({
    queryKey: ['people'],
    queryFn: async () => {
        const response = await axios.get(API_URL + '/people')
        return response.data
    },
    initialData: [],
    retry: 0
})

export const useGetPerson = (id: string, enabled: boolean = true) => useQuery<Person, AxiosError<ApiError>>({
    queryKey: ['person:' + id],
    queryFn: async () => {
        const response = await axios.get(API_URL + '/people/' + id)
        return response.data
    },
    initialData: { name: '', id: '', skills: [], topSkill: { id: '' } as UserSkill } as Person,
    retry: 0,
    enabled: enabled
})

export const useGetPersonManual = (id: string) => {
    const [error, setError] = useState<Error | null>(null)
    const [data, setData] = useState({ name: '', id: '', skills: [], topSkill: { id: '' } as UserSkill } as Person)
    const [isLoading, setIsLoading] = useState(false)

    const fetch = useCallback(async() => {
        setError(null)
        setIsLoading(true)
        axios.get(API_URL + '/people/' + id).then(response => {
            setData(response.data)
            setIsLoading(false)
        }).catch(err => {
            setError(err)
        })
    }, [id])

    return {
        fetch,
        data,
        isLoading,
        error
    }
}

export const useRegisterPerson = (auth0Id?: string, name?: string) => useQuery<Person, AxiosError<ApiError>>({
    queryKey: ['person:' + auth0Id],
    queryFn: async () => {
        if (!auth0Id || !name) {
            throw Error('auth0 or name cannot be null')
        }
        const response = await axios.post(API_URL + '/people/' + auth0Id, { auth0: auth0Id, name })
        return response.data
    },
    initialData: { name: '', id: '', skills: [], topSkill: { id: '' } as UserSkill } as Person,
    retry: 0,
    enabled: false
})

export const updatePersonSkill = async (userId: string, skillId: string, rating: number) => {
    if (!userId || !skillId || !rating) {
        throw Error('auth0 or name cannot be null')
    }
    const response = await axios.post(API_URL + '/people/' + userId + '/skill', { skillId, rating })
    return response.data
}

export const updateTopSkill = async (userId: string, skillId: string) => {
    if (!userId || !skillId) {
        throw Error('auth0 or name cannot be null')
    }
    const response = await axios.post(API_URL + '/people/' + userId + '/topSkill', { skillId })
    return response.data
}