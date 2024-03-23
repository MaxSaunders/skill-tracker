import { useEffect, useState } from 'react'
import { FaStar } from "react-icons/fa"
import { ImSpinner9 } from 'react-icons/im'
import { useAuth0 } from "@auth0/auth0-react";

import useSkillsApi from '@/Mock/Helpers/useSkillsApi'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Pager from '@/components/ui/pager'
import usePeopleApi from '@/Mock/Helpers/usePeopleApi'
import StarRating from '@/components/ui/starRating'
import { UserSkill } from '@/Types/Person'
import { Skill } from '@/Types/Skill'
import { LoginButton } from '@/components/ui/navigation';
import './myskills.css'

interface SkillRatingsProps {
    id: string;
    name: string;
}

const SkillRatings: React.FC<SkillRatingsProps> = ({ id, name }) => {
    console.log(id, name)
    const [rating, setRating] = useState<number>(0)
    const [hovered, setHovered] = useState<number>(0)

    let className = `mx-0.5 rating-${rating}`

    if (hovered) {
        className = `mx-0.5 hovered-${hovered}`
    }
    let comparison = rating
    if (hovered) {
        comparison = hovered
    }

    // TODO: actually add "api" call to change data
    return (
        <div className='flex' onMouseLeave={() => setHovered(0)}>
            <FaStar size='1.2rem' onMouseEnter={() => setHovered(1)} onClick={() => setRating(1)} className={`${className} star-active-${comparison >= 1}`} />
            <FaStar size='1.2rem' onMouseEnter={() => setHovered(2)} onClick={() => setRating(2)} className={`${className} star-active-${comparison >= 2}`} />
            <FaStar size='1.2rem' onMouseEnter={() => setHovered(3)} onClick={() => setRating(3)} className={`${className} star-active-${comparison >= 3}`} />
            <FaStar size='1.2rem' onMouseEnter={() => setHovered(4)} onClick={() => setRating(4)} className={`${className} star-active-${comparison >= 4}`} />
        </div>
    )
}

const MySkillsComponents = () => {
    const { user } = useAuth0();

    const pageSize = 10
    const [page, setPage] = useState<number>(0)
    const [paginatedResults, setPaginatedResults] = useState<UserSkill[]>([])

    const { loading: loadingSkills, results: skills, fetch: fetchSkills } = useSkillsApi()
    const { sessionUser } = usePeopleApi()

    useEffect(() => {
        fetchSkills()
    }, [fetchSkills])

    useEffect(() => {
        console.log({ skills })
        const skillsCopy = [...skills]
        const usersSkills = skillsCopy.map((sk: Skill) => {
            const userSkill = sessionUser?.skills?.find((us: UserSkill) => us.id === sk.id)

            return {
                ...sk,
                rating: userSkill?.rating ?? 0
            }
        })
        const temp = usersSkills.slice(page * pageSize, (page * pageSize) + pageSize)
        // const temp = skills.slice(page * pageSize, (page * pageSize) + pageSize)
        setPaginatedResults(temp)
    }, [skills, pageSize, page, sessionUser?.skills])

    if (loadingSkills) {
        return (
            <div className='flex justify-center h-full text-white align-bottom'>
                <ImSpinner9 className='animate-spin my-20' size='100px' />
            </div>
        )
    }

    return (
        <>
            <div className='flex justify-between items-end font-bold text-white border-b border-black'>
                <h1 className=' px-2 py-4 text-3xl'>
                    My Skills - {user?.name}
                </h1>
                <span className='py-2'>
                    <span className='grid grid-cols-2 items-center hover:bg-gray-900 px-2'><StarRating rating={1} showAll={false} /> Heard of it&nbsp;&nbsp;</span>
                    <span className='grid grid-cols-2 items-center hover:bg-gray-900 px-2'><StarRating rating={2} showAll={false} /> Used it&nbsp;&nbsp;</span>
                    <span className='grid grid-cols-2 items-center hover:bg-gray-900 px-2'><StarRating rating={3} showAll={false} /> Worked with it in PROD&nbsp;&nbsp;</span>
                    <span className='grid grid-cols-2 items-center hover:bg-gray-900 px-2'><StarRating rating={4} showAll={false} /> Im an Expert&nbsp;&nbsp;</span>
                </span>
            </div>
            <Table className='text-white'>
                <TableCaption>A list of your personal tracked competencies</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-bold w-[200px]">Skill</TableHead>
                        <TableHead className='font-bold w-[200px]'>My Rating</TableHead>
                        <TableHead className='font-bold'>Description</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedResults.map(({ id, name, description }) =>
                        <TableRow key={id}>
                            <TableCell className="font-medium">{name}</TableCell>
                            <TableCell><SkillRatings id={id} name={name} /></TableCell>
                            <TableCell>{description}</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <Pager current={page} setPage={setPage} totalPages={Math.ceil(skills.length / pageSize)} />
        </>
    )
}

const MySkills = () => {
    const { isAuthenticated, isLoading: isLoadingAuth } = useAuth0();

    if (isLoadingAuth) {
        return (
            <div className='font-bold text-white text-3xl min-w-max absolute h-max inset-1/2 -translate-x-1/2 -translate-y-1/2'>
                Logging in...
            </div>
        )
    }

    if (!isAuthenticated) {
        return (
            <div className='font-bold text-3xl text-white min-w-max h-max absolute inset-1/2 -translate-x-1/2 -translate-y-1/2'>
                <div className='flex mb-10 justify-center'>
                    Please login to continue
                </div>
                <div className='flex justify-center'>
                    <LoginButton />
                </div>
            </div>
        )
    }

    return (
        <MySkillsComponents />
    )
}

export default MySkills
