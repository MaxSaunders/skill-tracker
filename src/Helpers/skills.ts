import axios, { AxiosError } from "axios"
import { ApiError, Skill } from "@/Types"
import { useQuery } from "@tanstack/react-query"

const API_URL = import.meta.env.VITE_API_URL

export const useGetSkills = () => useQuery<Skill[], AxiosError<ApiError>>({
    queryKey: ['skills'],
    queryFn: async () => {
        const response = await axios.get(API_URL + '/skills')
        return response.data
    },
    initialData: [],
    retry: 0
})

export const useGetSkill = (id: string) => useQuery<Skill, AxiosError<ApiError>>({
    queryKey: ['skills:' + id],
    queryFn: async () => {
        const response = await axios.get(API_URL + '/skills/' + id)
        return response.data
    },
    initialData: { id: '', name: '', description: ''} as Skill,
    retry: 0
})

// export const useAddSkill = () =>