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

export const useGetPerson = (id: string) => useQuery<Person, AxiosError<ApiError>>({
    queryKey: ['person:' + id],
    queryFn: async () => {
        const response = await axios.get(API_URL + '/people/' + id)
        return response.data
    },
    initialData: { name: '', id: '', skills: [], topSkill: { id: '' } as UserSkill } as Person,
    retry: 0
})