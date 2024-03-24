import { useCallback, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth0 } from "@auth0/auth0-react"
import { PiSealCheckBold } from "react-icons/pi";

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
import { LoginButton } from '@/components/ui/navigation';
import LoadingSpinner from '@/components/ui/loadingSpinner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import SortIcon from '@/components/ui/sortIcon'
import { PageErrorsContext } from '@/components/ui/error';
import { updateTopSkill, useGetPersonManual, useGetSkills, updatePersonSkill } from '@/Helpers';
import useFilterSort from '@/Helpers/useFIlterSort'
import RatingLegend from '@/components/ui/ratingLegend'
import { UserSkill, Skill } from '@/Types'
import SkillRatings from './skillRatings';

const MySkillsComponents = () => {
    const { user: authUser } = useAuth0();
    const pageSize = 10
    const [page, setPage] = useState<number>(0)
    const [paginatedResults, setPaginatedResults] = useState<UserSkill[]>([])
    const { addPageError } = useContext(PageErrorsContext)
    const [sortedSkills, setSortedSkills] = useState<UserSkill[]>([])
    const { sort, sortFunction, changeSort, filter, setFilter, filterFunction, isAsc } = useFilterSort<UserSkill>({ sort: 'rating' })

    const { isPending: pendingSkills, isLoading: loadingSkills, data: skills, error: skillsError } = useGetSkills()
    const { isLoading: isLoadingUser, data: user, error: userError, fetch: fetchUser } = useGetPersonManual(authUser?.sub ?? '')
    const topSkill = user?.topSkill

    useEffect(() => {
        fetchUser()
    }, [fetchUser])

    useEffect(() => {
        if (user) {
            const usersSkills = skills.map((sk: Skill) => {
                const userSkill = user?.skills?.find((us: UserSkill) => us.id === sk.id)

                return {
                    ...sk,
                    rating: userSkill?.rating ?? 0
                }
            })
            setSortedSkills((usersSkills?.filter(filterFunction('name')).toSorted(sortFunction)))
        } else {
            setSortedSkills([])
        }
    }, [skills, sort, filter, user, filterFunction, sortFunction])

    useEffect(() => {
        setPaginatedResults(sortedSkills.slice(page * pageSize, (page * pageSize) + pageSize))
    }, [pageSize, page, user, sortedSkills])

    const _updateTopSkill = useCallback((newTopSkillId: string) => {
        updateTopSkill(authUser?.sub ?? '', newTopSkillId).then(() => {
            fetchUser()
        })
    }, [authUser?.sub, fetchUser])

    const _updateAndFetch = useCallback((userId: string, skillId: string, newRating: number) => {
        updatePersonSkill(userId, skillId, newRating).then(() => {
            fetchUser()
        })
    }, [fetchUser])

    useEffect(() => {
        if (skillsError?.message) {
            addPageError({ message: skillsError.message, code: skillsError.code })
        }
        if (userError?.message) {
            addPageError({ message: userError.message, code: userError.code })
        }
    }, [addPageError, userError, skillsError])

    if (loadingSkills || pendingSkills || (isLoadingUser && !user)) {
        return <LoadingSpinner />
    }

    return (
        <>
            <div className='flex justify-between items-end font-bold text-white border-b border-black'>
                <h1 className='px-2 py-4 text-3xl'>
                    My Skills - {user?.name}
                </h1>
                <div className='hidden lg:flex'>
                    <RatingLegend />
                </div>
            </div>
            <div className='grid gap-y-8 gap-x-10 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 justify-between text-white pb-8 pt-4 px-3 font-semibold text-xl'>
                <div className='grid grid-cols-2 lg:grid-cols-4 items-center'>
                    <span>
                        Top Skill:
                    </span>
                    <Link to={'/skills/' + topSkill?.id} className='hover:text-blue-500 text-yellow-500 flex w-100 justify-end'>
                        {topSkill?.name}
                    </Link>
                </div>
                <div className='hidden xl:block 2xl:col-span-2' />
                <div className='flex items-center'>
                    <Label className='mr-3 text-lg'>Search</Label>
                    <Input className='text-black' onChange={e => setFilter(e.target.value)} value={filter} />
                </div>
            </div>
            <Table className='text-white'>
                <TableCaption>A list of your personal tracked competencies</TableCaption>
                <TableHeader>
                    <TableRow className='hover:bg-transparent text-lg'>
                        <TableHead className="font-bold w-[200px]">
                            <div onClick={() => changeSort('name', false)} className='hover:cursor-pointer hover:text-blue-500 flex items-center'>
                                Skill&nbsp;&nbsp;
                                <SortIcon sortName='name' isAsc={isAsc} sort={sort} />
                            </div>
                        </TableHead>
                        <TableHead className='font-bold w-[200px]'>
                            <div onClick={() => changeSort('rating')} className='hover:cursor-pointer hover:text-blue-500 flex items-center'>
                                My Rating&nbsp;&nbsp;
                                <SortIcon sortName='rating' isAsc={isAsc} sort={sort} />
                            </div>
                        </TableHead>
                        <TableHead className='font-bold hidden lg:table-cell'>Description</TableHead>
                        <TableHead />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedResults.map(({ id, name, description, rating }) =>
                        <TableRow key={id} className='hover:bg-gray-700 text-lg'>
                            <TableCell className="font-medium">
                                <Link to={'/skills/' + id} className='w-100 block hover:text-blue-500'>
                                    {name}
                                </Link>
                            </TableCell>
                            <TableCell><SkillRatings id={id} initialRating={rating} updateAndFetch={_updateAndFetch} /></TableCell>
                            <TableCell className='hidden lg:table-cell'>
                                {description}
                            </TableCell>
                            <TableCell className='py-0 items-center'>
                                <div className='flex justify-end'>
                                    {(topSkill?.id !== id) && (
                                        <Button onClick={() => _updateTopSkill(id)} className='bg-color-transparent p-0 block h-full'>
                                            <span className='hidden md:flex items-center py-2 px-3 text-green-500'>
                                                <PiSealCheckBold size='1.5rem' className='mr-2' />
                                                Set Top Skill
                                            </span>
                                            <span className='block md:hidden p-2 text-green-500'>
                                                <PiSealCheckBold size='1.5rem' />
                                            </span>
                                        </Button>
                                    )}
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
            <div className='font-bold text-xl md:text-3xl text-white text-center h-max mt-56'>
                <div className='flex mb-10 justify-center break-words'>
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
