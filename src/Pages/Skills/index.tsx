import { useCallback, useContext, useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCaption,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Pager from '@/components/ui/pager';
import Modal from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/ui/loadingSpinner';
import { PageErrorsContext } from '@/components/ui/error';
import { NewSkillObj, Skill } from '@/Types';
import { useGetPeople, useGetSkills } from '@/Helpers';
import NewSkillForm from './newSkillForm';
import SkillRow from './skillRow';

const API_URL = import.meta.env.VITE_API_URL

const SkillsPage = () => {
    const { isAuthenticated } = useAuth0();

    const pageSize = 10
    const [page, setPage] = useState<number>(0)
    // TODO: need to add these thing to url params
    // - page number
    // - filter info
    const [paginatedResults, setPaginatedResults] = useState<Skill[]>([])
    const [filteredResults, setFilteredResults] = useState<Skill[]>([])
    const [filter, setFilter] = useState<string>('')
    const { addPageError } = useContext(PageErrorsContext)

    const { isPending: pendingSkills, isLoading: loadingSkills, data: skills, error: skillsError, refetch: refetchSkills } = useGetSkills()
    const { isPending: pendingPeople, isLoading: loadingPeople, data: people, error: peopleError } = useGetPeople()

    const addSkill = useCallback(async (skill: NewSkillObj) => {
        return await axios.post(API_URL + '/skills/new', skill)
    }, [])

    const [addingNew, setAddingNew] = useState(false)
    const validateName = useCallback((newName: string) => skills.find(s => s.name.toLowerCase() === newName.toLowerCase()) ? 'Skill already exists' : undefined, [skills])
    const onSubmit = useCallback((data: NewSkillObj) => {
        addSkill(data).then(() => {
            refetchSkills()
        })
        setAddingNew(false)
    }, [addSkill, refetchSkills])

    useEffect(() => {
        setFilteredResults(skills.filter(s => s.name.toLowerCase().includes(filter.toLowerCase()) || s.description.toLowerCase().includes(filter.toLowerCase())))
    }, [filter, skills])

    useEffect(() => {
        const sortedAndFiltered = filteredResults.toSorted((a, b) =>
            a.name.localeCompare(b.name)
        ).slice(
            page * pageSize, (page * pageSize) + pageSize
        )
        setPaginatedResults(sortedAndFiltered)
    }, [pageSize, page, filteredResults])

    useEffect(() => {
        if (skillsError?.message) {
            addPageError({ message: skillsError.message })
        }
        if (peopleError?.message) {
            addPageError({ message: peopleError.message })
        }
    }, [addPageError, peopleError?.message, skillsError?.message])

    if (pendingSkills || loadingSkills || pendingPeople || loadingPeople) {
        return <LoadingSpinner />
    }

    return (
        <>
            {addingNew &&
                <Modal>
                    <NewSkillForm onSubmit={onSubmit} validateName={validateName} close={() => setAddingNew(false)} />
                </Modal>
            }
            <div className='mb-5'>
                <div className='flex items-center justify-between border-b border-black'>
                    <h1 className='text-3xl font-bold px-2 py-4 text-white'>
                        Skills
                    </h1>
                    <span className='grid grid-cols-4 gap-x-5 items-end'>
                        <span className={`${isAuthenticated ? 'col-span-3' : 'col-span-4'} flex items-center`}>
                            <Label className='font-bold text-white mr-2 text-xl'>Search</Label>
                            <Input placeholder='skill name' onChange={e => setFilter(e.target.value)} />
                        </span>
                        {isAuthenticated && <Button className='order-last bg-green-600 font-bold' onClick={() => setAddingNew(true)}>Add New</Button>}
                    </span>
                </div>

                <Table className='text-white'>
                    <TableCaption>A list of your company's tracked competencies</TableCaption>
                    <TableHeader>
                        <TableRow className='hover:bg-transparent'>
                            <TableHead className="font-bold w-[100px]">Skill</TableHead>
                            <TableHead className='font-bold hidden lg:table-cell '>Description</TableHead>
                            <TableHead className='font-bold'>Top Users</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedResults.map((skill) =>
                            <SkillRow key={skill.id} skill={skill} people={people} />
                        )}
                    </TableBody>
                </Table>
                <Pager current={page} setPage={setPage} totalPages={Math.ceil(filteredResults.length / pageSize)} />
            </div>
        </>
    )
}

export default SkillsPage
