import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StarRating from '@/components/ui/starRating';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetPerson } from '@/Helpers';
import { UserSkill } from '@/Types';
import LoadingSpinner from '@/components/ui/loadingSpinner';
import SortIcon from '@/components/ui/sortIcon';
import useFilterSort from '@/Helpers/useFIlterSort';
import { PageErrorsContext } from '@/components/ui/error';
import './person.css'

const getColor = () => {
    // const getColor = (name: string) => {
    // const colors = ['blue-700', 'yellow-700', 'red-500', 'green-600', 'gray-500']
    // const charIndex = name.charCodeAt(0) - 65
    // const colorIndex = charIndex % colors.length;
    // return `bg-${colors[colorIndex]}`
    return 'bg-green-700'
}

const getInitials = (name?: string): string => {
    if (!name) return ''
    const [first, last] = name.split(' ')
    return first[0].toUpperCase() + last[0].toUpperCase()
}

const PersonPage = () => {
    const [sortedSkills, setSortedSkills] = useState<UserSkill[]>([])
    const { id } = useParams()
    const { isPending, isLoading, data: user, error } = useGetPerson(id ?? '')
    const { sort, sortFunction, changeSort, filter, setFilter, filterFunction, isAsc } = useFilterSort<UserSkill>({ sort: 'rating' })
    const { addPageError } = useContext(PageErrorsContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (user) {
            setSortedSkills((user?.skills
                ?.filter(filterFunction('name')) || [])
                .toSorted(sortFunction))
        } else {
            setSortedSkills([])
        }
    }, [user, sort, filter, filterFunction, sortFunction])

    useEffect(() => {
        if (error?.message) {
            addPageError({ message: error.message, code: error.code })
        }
    }, [addPageError, error])

    if (isLoading || isPending) {
        return <LoadingSpinner />
    }

    if (!user) {
        return (
            <div className='flex justify-center mt-20'>
                <Card className='justify-center flex bg-transparent min-w-min w-1/2 text-red-500 font-bold text-5xl py-10 border-red-600'>
                    <span className='mr-4'>
                        <FaUser />
                    </span>
                    <span>
                        No user found
                    </span>
                </Card>
            </div>
        )
    }

    return (
        <div className='grid grid-cols-1 xl:grid-cols-3 gap-x-4'>
            <div className='col-span-1 m-4'>
                <div className='p-2 text-white bg-transparent items-center w-full border-0'>
                    <div className='w-full justify-between items-center py-2 flex'>
                        <span className={`user-icon ${getColor()}`}>
                            <span className='user-icon-initials'>
                                {getInitials(user?.name)}
                            </span>
                        </span>
                        <h1 className='font-bold text-white text-3xl'>
                            {user?.name}
                        </h1>
                    </div>
                    <hr />

                    <Table>
                        <TableBody className='font-bold'>
                            <TableRow onClick={() => navigate(`/skills/${user?.topSkill?.id}`)} className='hover:bg-gray-700 hover:text-blue-500 hover:cursor-pointer'>
                                <TableCell>Top Skill</TableCell>
                                <TableCell className='justify-end flex'>
                                    <div className='flex items-center'>
                                        <span>
                                            {user?.topSkill?.name ?? 'None'}
                                        </span>
                                        <span className={`${user?.topSkill?.rating ? 'ml-4' : ''}`}>
                                            {user?.topSkill?.rating ? <StarRating rating={user?.topSkill?.rating ?? 0} /> : <></>}
                                        </span>
                                    </div>
                                </TableCell>
                            </TableRow>
                            <TableRow className='hover:bg-gray-700'>
                                <TableCell>Phone</TableCell>
                                <TableCell className='justify-end flex'></TableCell>
                            </TableRow>
                            <TableRow className='hover:bg-gray-700'>
                                <TableCell>Email</TableCell>
                                <TableCell className='justify-end flex'></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className='col-span-1 xl:col-span-2 mt-5'>
                <div className='w-full grid grid-col-1 xl:grid-cols-2 px-7 mb-10 items-center gap-1.5'>
                    <div>
                        <Label className='text-white font-bold text-xl'>Skill Search</Label>
                        <Input id='skill' placeholder='Skill' onChange={e => setFilter(e.target.value)} />
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow className='hover:bg-transparent'>
                            <TableHead>
                                <div onClick={() => changeSort('name', false)} className='flex items-center font-bold hover:text-blue-500 text-lg px-5 py-2 rounded w-min cursor-pointer'>
                                    Skill
                                    <SortIcon sortName='name' sort={sort} isAsc={isAsc} />
                                </div>
                            </TableHead>
                            <TableHead>
                                <div onClick={() => changeSort('rating')} className='flex items-center font-bold hover:text-blue-500 text-lg px-5 py-2 rounded w-min cursor-pointer'>
                                    Rating
                                    <SortIcon sortName='rating' sort={sort} isAsc={isAsc} />
                                </div>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedSkills.map(s =>
                            <TableRow onClick={() => navigate(`/skills/${s.id}`)} key={s.id} className='hover:cursor-pointer hover:text-blue-500 text-white border-0 hover:bg-gray-700'>
                                <TableCell>
                                    <span className='flex items-center' key={s.id}>
                                        <span className='font-semibold'>
                                            {s.name}
                                        </span>
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span><StarRating rating={s.rating} /></span>
                                </TableCell>
                            </TableRow>
                        )}
                        {!sortedSkills.length &&
                            <TableRow className='text-white font-semibold'>
                                <TableCell className='text-white font-semibold'>
                                    No Matching skills found
                                </TableCell>
                            </TableRow>
                        }
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default PersonPage
