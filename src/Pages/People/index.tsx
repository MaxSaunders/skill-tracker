import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Pager from '@/components/ui/pager';
import LoadingSpinner from '@/components/ui/loadingSpinner';
import StarRating from '@/components/ui/starRating';
import { PageErrorsContext } from '@/components/ui/error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Person, UserSkill } from '@/Types';
import { useGetPeople } from '@/Helpers';

const GetTopSkills = (skillsArray?: UserSkill[]) => skillsArray?.toSorted((a, b) => a.rating < b.rating ? 1 : -1).splice(0, 3)

const PeoplePage = () => {
    const pageSize = 10
    const { isPending: pendingPeople, isLoading: loadingPeople, data: people, error } = useGetPeople()
    const [pageResults, setPageResults] = useState<Person[]>([])
    const [page, setPage] = useState<number>(0)
    const [filterString, setFilterString] = useState<string>('')
    const { addPageError } = useContext(PageErrorsContext)

    // TODO: need to add these thing to url params
    // - page number
    // - filter info
    const [filteredResults, setFilteredResults] = useState<Person[]>([])

    useEffect(() => {
        setFilteredResults(people?.filter(a => {
            return a.name.toLowerCase().includes(filterString.toLowerCase())
        }))
    }, [filterString, people])

    useEffect(() => {
        const temp = filteredResults.slice(page * pageSize, (page * pageSize) + pageSize)
        // if (temp.length < pageSize) {
        //     for (let i = 0; i < (pageSize - temp.length); i++) {
        //         temp.push({ id: '', name: '', skills: [], topSkill: {} as UserSkill } as Person)
        //     }
        // }
        setPageResults(temp)
    }, [page, filterString, filteredResults])

    useEffect(() => {
        if (error?.message) {
            addPageError({ message: error.message })
        }
    }, [addPageError, error])

    if (pendingPeople || loadingPeople) {
        return <LoadingSpinner />
    }

    return (
        <>
            <div className='flex justify-between border-b border-black items-center'>
                <h1 className='text-3xl font-bold px-2 py-4 text-white'>
                    People
                </h1>

                <span className='w-full max-w-sm items-center flex'>
                    <Label className='mr-4 min-w-min text-white font-bold text-xl'>Search</Label>
                    <Input id='person' placeholder='Name' onChange={e => setFilterString(e.target.value)} />
                </span>
            </div>
            <Table className='text-white'>
                <TableCaption>A list of your tracked employees</TableCaption>
                <TableHeader>
                    <TableRow className='hover:bg-transparent'>
                        <TableHead className='font-bold min-w-min'>Name</TableHead>
                        <TableHead className='font-bold w-max'>Top Skills</TableHead>
                        <TableHead className='font-bold'>Top Skill</TableHead>
                        <TableHead className='font-bold'>Attitude</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {pageResults.map(({ id, name, skills, topSkill }) =>
                        <TableRow key={id} className='hover:bg-gray-700'>
                            <TableCell className="font-medium p-0">
                                <Link to={`/people/${id}`} className='p-4 hover:text-blue-500 flex items-center'>
                                    <span className='mr-2'>
                                        <FaUser />
                                    </span>
                                    <span className='mr-2 text-lg font-bold'>
                                        {name}
                                    </span>
                                </Link>
                            </TableCell>
                            <TableCell className='p-0'>
                                <Link to={`/people/${id}`} className='p-4 grid 3xl:grid-cols-6 xl:grid-cols-4 lg:grid-cols-2 grid-cols-1 gap-y-2'>
                                    {GetTopSkills(skills)?.map(({ rating, name, id }) =>
                                        <div className='grid grid-cols-2 items-center' key={id + ':' + name}>
                                            <span className='font-bold mr-1 text-lg'>
                                                {name}
                                            </span>
                                            <span className={`flex items-baseline`}>
                                                <StarRating rating={rating} />
                                            </span>
                                        </div>
                                    )}
                                </Link>
                            </TableCell>
                            <TableCell className='p-0'>
                                <Link to={`/people/${id}`} className='p-4 grid grid-cols-2 items-center min-h-full'>
                                    <span className='font-bold mr-1 text-yellow-500 text-lg'>
                                        {topSkill?.name}
                                    </span>
                                    <span className={`flex items-baseline text-yellow-500`}>
                                        <StarRating rating={topSkill?.rating ?? 0} />
                                    </span>
                                </Link>
                            </TableCell>
                            <TableCell className='p-0'>
                                <Link to={`/people/${id}`} className='p-4 flex items-center'>
                                    <span className='mr-2'>
                                        Angry Boi
                                    </span>
                                </Link>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <Pager current={page} size={5} setPage={setPage} totalPages={Math.ceil(filteredResults.length / pageSize)} />
        </>
    )
}

export default PeoplePage
