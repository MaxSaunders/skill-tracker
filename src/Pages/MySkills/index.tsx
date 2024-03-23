import { useCallback, useEffect, useState } from 'react'
import { FaStar } from "react-icons/fa"
import { useAuth0 } from "@auth0/auth0-react";

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
import StarRating from '@/components/ui/starRating'
import { LoginButton } from '@/components/ui/navigation';
import LoadingSpinner from '@/components/ui/loadingSpinner';
import { Button } from '@/components/ui/button';
import { updatePersonSkill, updateTopSkill, useGetPerson, useGetSkills } from '@/Helpers';
import { UserSkill, Skill } from '@/Types'
import './myskills.css'

interface SkillRatingsProps {
    id: string;
    initialRating: number;
}

const SkillRatings: React.FC<SkillRatingsProps> = ({ id, initialRating }) => {
    const { user } = useAuth0();
    const [rating, setRating] = useState(initialRating)
    // for some reason this is not being set correctly
    const [hovered, setHovered] = useState<number>(0)
    const { refetch: refetchSkills } = useGetSkills()

    let className = `mx-0.5 rating-${rating}`

    if (hovered) {
        className = `mx-0.5 hovered-${hovered}`
    }
    let comparison = rating
    if (hovered) {
        comparison = hovered
    }

    useEffect(() => {
        // I don't love this
        setRating(initialRating)
    }, [initialRating])

    const updateRating = useCallback((newRating: number) => () => {
        setRating(newRating)

        if (user?.sub) {
            updatePersonSkill(user.sub, id, newRating).then(() => {
                refetchSkills()
            })
        }

        return undefined
    }, [id, refetchSkills, user])

    return (
        <div className='flex' onMouseLeave={() => setHovered(0)}>
            <FaStar size='1.2rem' onMouseEnter={() => setHovered(1)} onClick={updateRating(1)} className={`${className} star-active-${comparison >= 1}`} />
            <FaStar size='1.2rem' onMouseEnter={() => setHovered(2)} onClick={updateRating(2)} className={`${className} star-active-${comparison >= 2}`} />
            <FaStar size='1.2rem' onMouseEnter={() => setHovered(3)} onClick={updateRating(3)} className={`${className} star-active-${comparison >= 3}`} />
            <FaStar size='1.2rem' onMouseEnter={() => setHovered(4)} onClick={updateRating(4)} className={`${className} star-active-${comparison >= 4}`} />
        </div>
    )
}

const MySkillsComponents = () => {
    const { user: authUser } = useAuth0();
    const pageSize = 10
    const [page, setPage] = useState<number>(0)
    const [paginatedResults, setPaginatedResults] = useState<UserSkill[]>([])

    const { isPending: pendingSkills, isLoading: loadingSkills, data: skills, error: skillsError } = useGetSkills()
    const { isPending, isLoading, data: user, error: userError, refetch: refetchUser } = useGetPerson(authUser?.sub ?? '', false)
    // need to disable auto to refetch???
    // might be error on rating stars as well

    useEffect(() => {
        refetchUser()
    }, [refetchUser])

    const topSkill = user?.topSkill
    console.log({ user })

    useEffect(() => {
        const skillsCopy = [...skills]
        const usersSkills = skillsCopy.map((sk: Skill) => {
            const userSkill = user?.skills?.find((us: UserSkill) => us.id === sk.id)

            return {
                ...sk,
                rating: userSkill?.rating ?? 0
            }
        })
        const temp = usersSkills.slice(page * pageSize, (page * pageSize) + pageSize)
        setPaginatedResults(temp)
    }, [skills, pageSize, page, user])

    const _updateTopSkill = useCallback((newTopSkillId: string) => {
        updateTopSkill(authUser?.sub ?? '', newTopSkillId).then(() => {
            refetchUser()
        })
    }, [authUser?.sub, refetchUser])

    if (loadingSkills || pendingSkills || isPending || isLoading) {
        return <LoadingSpinner />
    }

    if (skillsError || userError) {
        return (
            <div className='flex justify-center text-red-500'>
                <div>
                    {skillsError?.message}
                </div>
                <div>
                    {userError?.message}
                </div>
            </div>
        )
    }

    return (
        <>
            <div className='flex justify-between items-end font-bold text-white border-b border-black'>
                <h1 className='px-2 py-4 text-3xl'>
                    My Skills - {user?.name}
                </h1>
                <span className='py-2'>
                    <span className='grid grid-cols-2 items-center hover:bg-gray-900 px-2'><StarRating rating={1} showAll={false} /> Heard of it&nbsp;&nbsp;</span>
                    <span className='grid grid-cols-2 items-center hover:bg-gray-900 px-2'><StarRating rating={2} showAll={false} /> Used it&nbsp;&nbsp;</span>
                    <span className='grid grid-cols-2 items-center hover:bg-gray-900 px-2'><StarRating rating={3} showAll={false} /> Worked with it in PROD&nbsp;&nbsp;</span>
                    <span className='grid grid-cols-2 items-center hover:bg-gray-900 px-2'><StarRating rating={4} showAll={false} /> Im an Expert&nbsp;&nbsp;</span>
                </span>
            </div>
            <div className='text-white pb-8 pt-4 px-3 text-xl'>
                Top Skill: {topSkill?.name}
            </div>
            <Table className='text-white'>
                <TableCaption>A list of your personal tracked competencies</TableCaption>
                <TableHeader>
                    <TableRow className='hover:bg-gray-700'>
                        <TableHead className="font-bold w-[200px]">Skill</TableHead>
                        <TableHead className='font-bold w-[200px]'>My Rating</TableHead>
                        <TableHead className='font-bold'>Description</TableHead>
                        <TableHead />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedResults.map(({ id, name, description, rating }) =>
                        <TableRow key={id} className='hover:bg-gray-700'>
                            <TableCell className="font-medium">{name}</TableCell>
                            <TableCell><SkillRatings id={id} initialRating={rating} /></TableCell>
                            <TableCell>{description}</TableCell>
                            <TableCell className='py-0 items-center'>
                                <div className='flex justify-end'>
                                    {(topSkill?.id !== id) && <Button onClick={() => _updateTopSkill(id)} className='bg-green-800 block h-full'>Set Top Skill</Button>}
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <Pager current={page} setPage={setPage} totalPages={Math.ceil(skills.length / pageSize)} />
        </>
    )
}

const MySkillsPage = () => {
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

export default MySkillsPage
