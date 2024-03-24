import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { FaUser, FaRegSmileWink, FaRegSmileBeam } from "react-icons/fa";
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

const getRandomSmileyFace = () => {
    const faces = [FaRegSmileBeam, FaRegSmileWink]
    const number = Math.floor(Math.random() * faces.length);
    const FaceComp = faces[number]

    return <FaceComp className='text-green-600' size='2rem' />
}

const GetTopSkills = (skillsArray?: UserSkill[], topSkill?: UserSkill) =>
    skillsArray?.filter(sk => sk.id !== topSkill?.id)
        ?.toSorted((a, b) => a.rating < b.rating ? 1 : -1)
        .splice(0, 3)

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
                        <TableHead className='font-bold w-max hidden md:table-cell'>Top Skills</TableHead>
                        <TableHead className='font-bold'>Top Skill</TableHead>
                        <TableHead className='font-bold hidden xl:table-cell'>
                            <div className='flex justify-end'>
                                Attitude
                            </div>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {pageResults.map(({ id, name, skills, topSkill }) =>
                        <TableRow key={id} className='hover:bg-gray-700'>
                            <TableCell className="font-medium p-0">
                                <Link to={`/people/${id}`} className='p-4 hover:text-blue-500 flex items-center'>
                                    <span className='mr-2'>
                                        <FaUser size='1.2rem' />
                                    </span>
                                    <span className='mr-2 text-lg font-bold'>
                                        {name}
                                    </span>
                                </Link>
                            </TableCell>
                            <TableCell className='p-0 hidden md:grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-y-2'>
                                {GetTopSkills(skills, topSkill)?.map(({ rating, name, id: skill_id }, index) =>
                                    <Link
                                        to={`/skill/${skill_id}`}
                                        key={skill_id + ':' + name}
                                        className={`
                                            grid grid-cols-2 px-4 py-2 m-2 hover:text-blue-500 items-center
                                            ${(index == 0) ? 'hidden md:grid' : ''}
                                            ${(index == 1) ? 'hidden xl:grid' : ''}
                                            ${(index == 2) ? 'hidden 2xl:grid' : ''}
                                        `}
                                    >
                                        <div className='font-bold mr-1 text-lg'>
                                            {name}
                                        </div>
                                        <div className={`flex items-baseline justify-end`}>
                                            <StarRating rating={rating} />
                                        </div>
                                    </Link>
                                )}
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
                            <TableCell className='p-0 hidden xl:table-cell items-center'>
                                <div className='flex justify-end mr-5'>
                                    {getRandomSmileyFace()}
                                </div>
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
