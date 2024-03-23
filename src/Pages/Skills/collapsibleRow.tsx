import { useState } from 'react'
import { Link } from 'react-router-dom';
import { FaChevronDown } from "react-icons/fa";
import {
    TableCell,
    TableRow,
} from "@/components/ui/table"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Skill, Person } from '@/Types';

const getTopUsersList = (skill: Skill, usersArray: Person[]) => {
    const topPeople = usersArray.toSorted((a, b) => {
        const userARating = a.skills.find(i => i.id === skill.id)?.rating ?? 0
        const userBRating = b.skills.find(i => i.id === skill.id)?.rating ?? 0
        return userARating > userBRating ? -1 : 1
    })

    return topPeople.map(p => ({ rating: p.skills.find(i => i.id === skill.id)?.rating ?? 0, ...p }))
}

interface CollapsibleRowProps {
    skill: Skill;
    people: Person[];
}

const CollapsibleRow: React.FC<CollapsibleRowProps> = ({ skill, people }) => {
    const [isOpen, setIsOpen] = useState(false)
    const sortedPeopleList = getTopUsersList(skill, people)
    const top3People = sortedPeopleList.slice(0, 3)
    return (
        <Collapsible key={skill.id} asChild onOpenChange={setIsOpen} open={isOpen}>
            <>
                <CollapsibleTrigger className='cursor-pointer' asChild onClick={() => setIsOpen(i => !i)}>
                    <TableRow>
                        <TableCell className='text-lg font-bold'>{skill.name}</TableCell>
                        <TableCell className='hidden lg:table-cell max-w-[1000px] whitespace-nowrap overflow-hidden overflow-ellipsis'>{skill.description}</TableCell>
                        <TableCell className='min-w-min'>
                            <span className='grid grid-cols-10 items-center text-lg'>
                                {top3People.map(person =>
                                    <span className='mr-3 col-span-3 grid grid-cols-2' key={person.id}>
                                        <span className='mr-1'>
                                            {person.name}
                                        </span>
                                        <span className='font-bold'>
                                            {person.rating}
                                        </span>
                                    </span>
                                )}
                                <span className='flex cursor-pointer align-center justify-end'>
                                    <FaChevronDown className={`transition-all duration-400 ${isOpen ? 'rotate-180' : ''}`} />
                                </span>
                            </span>
                        </TableCell>
                    </TableRow>
                </CollapsibleTrigger>
                <CollapsibleContent asChild>
                    <TableRow className='hover:bg-transparent'>
                        <TableCell colSpan={3}>
                            <div className='grid gap-y-1 gap-x-0 sm:grid-cols-3 xl:grid-cols-7'>
                                {sortedPeopleList.map(person =>
                                    <Link className='hover:text-blue-500 mr-3 p-1 font-semibold' to={`/people/${person.id}`} key={person.id}>
                                        <span className='mr-1'>
                                            {person.name} -
                                        </span>
                                        <span>
                                            {person.rating}
                                        </span>
                                    </Link>
                                )}
                            </div>
                        </TableCell>
                    </TableRow>
                </CollapsibleContent>
            </>
        </Collapsible>
    )
}

export default CollapsibleRow
