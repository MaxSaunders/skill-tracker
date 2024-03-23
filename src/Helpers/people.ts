import axios, { AxiosError } from "axios"
import { Person } from "@/Types"
import { useQuery } from "@tanstack/react-query"

const API_URL = import.meta.env.VITE_API_URL

export const useGetPeople = () => useQuery<Person[], AxiosError>({
    queryKey: ['people'],
    queryFn: async () => {
        const response = await axios.get(API_URL + '/people')
        return response.data
    },
    initialData: [],
    retry: 0
})