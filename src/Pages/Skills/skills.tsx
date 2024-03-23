import { useCallback, useEffect, useState } from 'react'
import axios from 'axios';
import { ImSpinner9 } from "react-icons/im";
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
import { NewSkillObj, Skill } from '@/Types';
import { useGetPeople, useGetSkills } from '@/Helpers';
import NewSkillForm from './newSkillForm';
import CollapsibleRow from './collapsibleRow';

const API_URL = import.meta.env.VITE_API_URL

const Skills = () => {
    const pageSize = 10
    const [page, setPage] = useState<number>(0)
    // TODO: need to add these thing to url params
    // - page number
    // - filter info
    const [paginatedResults, setPaginatedResults] = useState<Skill[]>([])
    const [filteredResults, setFilteredResults] = useState<Skill[]>([])
    const [filter, setFilter] = useState<string>('')

    const { isPending: pendingSkills, isLoading: loadingSkills, data: skills, error: skillsError, refetch: refetchSkills } = useGetSkills()
    const { isPending: pendingPeople, isLoading: loadingPeople, data: people, error: peopleError } = useGetPeople()

    console.log({ people, skills })

    const addSkill = useCallback(async (skill: NewSkillObj) => {
        return await axios.post(API_URL + '/skills/new', skill)
    }, [])

    const [addingNew, setAddingNew] = useState(false)
    const validateName = (newName: string) => skills.find(s => s.name.toLowerCase() === newName.toLowerCase()) ? 'Skill already exists' : undefined
    const onSubmit = (data: NewSkillObj) => {
        addSkill(data).then(() => {
            refetchSkills()
        })
        setAddingNew(false)
    }

    useEffect(() => {
        setFilteredResults(skills.filter(s => s.name.toLowerCase().includes(filter.toLowerCase()) || s.description.toLowerCase().includes(filter.toLowerCase())))
    }, [filter, skills])

    useEffect(() => {
        const temp = filteredResults.slice(page * pageSize, (page * pageSize) + pageSize)
        setPaginatedResults(temp)
    }, [pageSize, page, filteredResults])

    if (skillsError || peopleError) {
        return (
            <div className='flex justify-center text-red-500'>
                <div>
                    {skillsError?.message}
                </div>
                <div>
                    {peopleError?.message}
                </div>
            </div>
        )
    }

    if (pendingSkills || loadingSkills || pendingPeople || loadingPeople) {
        return (
            <div className='flex justify-center h-full text-white align-bottom'>
                <ImSpinner9 className='animate-spin my-20' size='100px' />
            </div>
        )
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
                        <span className='col-span-3 flex items-center'>
                            <Label className='font-bold text-white mr-2 text-xl'>Search</Label>
                            <Input placeholder='skill name' onChange={e => setFilter(e.target.value)} />
                        </span>
                        <Button className='bg-green-600 font-bold' onClick={() => setAddingNew(true)}>Add New</Button>
                    </span>
                </div>

                <Table className='text-white'>
                    <TableCaption>A list of your company's tracked competencies</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="font-bold w-[100px]">Skill</TableHead>
                            <TableHead className='font-bold hidden lg:table-cell '>Description</TableHead>
                            <TableHead className='font-bold'>Top Users</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedResults.map((skill) =>
                            <CollapsibleRow key={skill.id} skill={skill} people={people} />
                        )}
                    </TableBody>
                </Table>
                <Pager current={page} setPage={setPage} totalPages={Math.ceil(filteredResults.length / pageSize)} />
            </div>
        </>
    )
}

export default Skills
