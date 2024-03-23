import axios, { AxiosError } from "axios"
import { Skill } from "@/Types"
import { useQuery } from "@tanstack/react-query"

const API_URL = import.meta.env.VITE_API_URL

export const useGetSkills = () => useQuery<Skill[], AxiosError>({
    queryKey: ['skills'],
    queryFn: async () => {
        const response = await axios.get(API_URL + '/skills')
        return response.data
    },
    initialData: [],
    retry: 0
})

// export const useAddSkill = () =>