import { useMemo } from "react"
import { Link } from "react-router-dom"
import { TableCell, TableRow } from "@/components/ui/table"
import { Skill, Person } from "@/Types"
import StarRating from "@/components/ui/starRating"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getNumberIcon } from "@/Constants/NumberIcons"

const getTopUsersList = (skill: Skill, usersArray: Person[]) => {
    const topPeople = usersArray
        .filter((a) => {
            return a.skills.find((sk) => sk.id == skill.id)?.rating
        })
        .toSorted((a, b) => {
            const userARating = a.skills.find((i) => i.id === skill.id)?.rating ?? 0
            const userBRating = b.skills.find((i) => i.id === skill.id)?.rating ?? 0
            return userARating > userBRating ? -1 : 1
        })

    return topPeople.map((p) => ({
        rating: p.skills.find((i) => i.id === skill.id)?.rating ?? 0,
        ...p,
    }))
}

interface SkillRow {
    skill: Skill
    people: Person[]
}

const SkillRow: React.FC<SkillRow> = ({ skill, people }) => {
    const sortedPeopleList = useMemo(() => getTopUsersList(skill, people), [people, skill])
    const top3People = useMemo(() => sortedPeopleList.slice(0, 3), [sortedPeopleList])
    return (
        <TableRow className="hover:bg-gray-700 h-14">
            <TableCell className="p-0 font-bold">
                <Link
                    className="w-full block hover:text-green-500 border-2 border-transparent p-4 transition rounded-lg"
                    to={`/skills/${skill.id}`}
                >
                    {skill.name}
                </Link>
            </TableCell>
            <TableCell className="h-full p-0 hidden xl:table-cell max-w-[300px]">
                <Link
                    className="h-full block hover:text-green-500 border-l border-gray-600 px-4 py-2 m-2 transition"
                    to={`/skills/${skill.id}`}
                >
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="truncate">{skill.description}</div>
                            </TooltipTrigger>
                            <TooltipContent>{skill.description}</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </Link>
            </TableCell>
            <TableCell className="p-0 min-w-min overflow-y-hidden">
                <span className="grid grid-cols-8 xl:grid-cols-9 items-center">
                    {top3People.slice(0, 3)?.map((person, index) => (
                        <Link
                            className={`
                                my-3 py-1 px-4 sm:text-left col-span-8 md:col-span-4 2xl:col-span-3
                                hover:text-green-500 ${index == 1 ? "hidden md:grid" : ""}
                                ${index == 2 ? "hidden 2xl:grid" : ""} border-l border-gray-600
                            `}
                            to={`/people/${person.id}`}
                            key={person.id + "" + index}
                        >
                            <div className="flex gap-2 justify-end sm:justify-start truncate items-center">
                                <div className="hidden md:flex items-center">
                                    {getNumberIcon(index, 26)}
                                </div>
                                <div className="font-bold hidden sm:flex items-center">
                                    <StarRating rating={person.rating} />
                                </div>
                                <div className="mr-1 truncate">{person.name}</div>
                            </div>
                        </Link>
                    )) || <></>}
                </span>
            </TableCell>
            {/* <TableCell className="p-0 min-w-min overflow-y-hidden">
                <span className="grid grid-cols-8 xl:grid-cols-9 items-center">
                    {top3People.slice(0, 3)?.map((person, index) => (
                        <Link
                            className={`
                                text-right sm:text-left top-users-box my-3 py-1 px-4 col-span-8 md:col-span-4 2xl:col-span-3 grid grid-cols-1 sm:grid-cols-2
                                hover:text-green-500 ${index == 1 ? "hidden md:grid" : ""}
                                ${index == 2 ? "hidden 2xl:grid" : ""} border-l border-gray-600
                            `}
                            to={`/people/${person.id}`}
                            key={person.id + "" + index}
                        >
                            <div className="mr-1 truncate">{person.name}</div>
                            <div className="font-bold hidden sm:flex justify-end items-center">
                                <StarRating rating={person.rating} />
                            </div>
                        </Link>
                    )) || <></>}
                </span>
            </TableCell> */}
        </TableRow>
    )
}

export default SkillRow
