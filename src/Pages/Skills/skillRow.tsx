import { Link } from 'react-router-dom';
import {
    TableCell,
    TableRow,
} from "@/components/ui/table"
import { Skill, Person } from '@/Types';

const getTopUsersList = (skill: Skill, usersArray: Person[]) => {
    const topPeople = usersArray.toSorted((a, b) => {
        const userARating = a.skills.find(i => i.id === skill.id)?.rating ?? 0
        const userBRating = b.skills.find(i => i.id === skill.id)?.rating ?? 0
        return userARating > userBRating ? -1 : 1
    })

    return topPeople.map(p => ({ rating: p.skills.find(i => i.id === skill.id)?.rating ?? 0, ...p }))
}

interface SkillRow {
    skill: Skill;
    people: Person[];
}

const SkillRow: React.FC<SkillRow> = ({ skill, people }) => {
    const sortedPeopleList = getTopUsersList(skill, people)
    const top3People = sortedPeopleList.slice(0, 3)
    return (
        <TableRow className='hover:bg-gray-700'>
            <TableCell className='p-0 text-lg font-bold'>
                <Link className='w-full block hover:text-blue-500 border-2 border-transparent p-4 hover:border-blue-500 rounded-lg' to={`/skills/${skill.id}`}>
                    {skill.name}
                </Link>
            </TableCell>
            <TableCell className='h-full p-0 hidden lg:table-cell max-w-[1000px] whitespace-nowrap overflow-hidden overflow-ellipsis'>
                <Link className='w-full h-full block hover:text-blue-500 border-2 border-transparent p-4 hover:border-blue-500 rounded-lg' to={`/skills/${skill.id}`}>
                    {skill.description}
                </Link>
            </TableCell>
            <TableCell className='p-0 min-w-min'>
                <span className='grid grid-cols-10 items-center text-lg'>
                    {top3People?.map(person =>
                        <Link className='hover:text-blue-500 border-2 border-transparent p-4 hover:border-blue-500 rounded-lg mr-3 p-1 font-semibold mr-3 col-span-3 grid grid-cols-2' to={`/people/${person.id}`} key={person.id}>
                            <span className='mr-1'>
                                {person.name}
                            </span>
                            <span className='font-bold'>
                                {person.rating}
                            </span>
                        </Link>
                    ) || <></>}
                </span>
            </TableCell>
        </TableRow>
    )
}

export default SkillRow
