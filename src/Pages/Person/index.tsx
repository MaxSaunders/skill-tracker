import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BiSort } from "react-icons/bi";
import { FaUser } from 'react-icons/fa';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StarRating from '@/components/ui/starRating';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetPerson } from '@/Helpers';
import { UserSkill } from '@/Types';
import LoadingSpinner from '@/components/ui/loadingSpinner';
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
    const [filter, setFilter] = useState<string>('')
    const [sort, setSort] = useState<keyof UserSkill>('rating')
    const [asc, setAsc] = useState<boolean>(true)
    const [sortedSkills, setSortedSkills] = useState<UserSkill[]>([])
    const { id } = useParams()
    const { isPending, isLoading, data: user, error } = useGetPerson(id ?? '')

    const _sort = useCallback((field: keyof UserSkill) => {
        if (sort == field && asc) {
            setAsc(false)
        } else {
            setSort(field)
            setAsc(true)
        }
    }, [asc, sort])

    useEffect(() => {
        if (user) {
            setSortedSkills((user?.skills?.filter(a => {
                return a.name.toLowerCase().includes(filter.toLowerCase())
            }) || []).toSorted((a, b) => {
                return (a[sort] < b[sort] ? -1 : 1) * (asc ? -1 : 1)
            }))
        } else {
            setSortedSkills([])
        }
    }, [user, sort, asc, filter])

    if (isLoading || isPending) {
        return <LoadingSpinner />
    }

    if (error) {
        return (
            <div className='mt-24 justify-center flex text-red-500 text-3xl'>
                {error?.response?.data?.error ?? 'Error fetching User'}
            </div>
        )
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
        <div className='grid grid-cols-3 gap-x-4'>
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
                            <TableRow className='hover:bg-gray-700'>
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
                                <TableCell>Email</TableCell>
                                <TableCell className='justify-end flex'>
                                    sample@gmail.com
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className='col-span-2 mt-5'>
                <span className='grid mb-5 w-full max-w-sm items-center gap-1.5'>
                    <Label className='text-white font-bold text-xl'>Skill Search</Label>
                    <Input type='' id='skill' placeholder='Skill' onChange={e => setFilter(e.target.value)} />
                </span>

                <Table>
                    <TableHeader>
                        <TableRow className='hover:bg-transparent'>
                            <TableHead>
                                <div onClick={() => _sort('name')} className='flex items-center font-bold hover:text-blue-500 hover:bg-opacity-70 hover:bg-white px-5 py-2 rounded w-min cursor-pointer'>
                                    Skill
                                    <BiSort />
                                </div>
                            </TableHead>
                            <TableHead>
                                <div onClick={() => _sort('rating')} className='flex items-center font-bold hover:text-blue-500 hover:bg-opacity-70 hover:bg-white px-5 py-2 rounded w-min cursor-pointer'>
                                    Rating
                                    <BiSort />
                                </div>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedSkills.map(s =>
                            <TableRow key={s.id} className='border-0 hover:bg-gray-700'>
                                <TableCell>
                                    <span className='flex items-center' key={s.id}>
                                        <span className='text-white font-semibold'>
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
