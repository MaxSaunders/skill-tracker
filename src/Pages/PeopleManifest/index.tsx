import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { FaUser } from "react-icons/fa"
import { PiSealCheckBold } from "react-icons/pi"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Pager from "@/components/ui/pager"
import LoadingSpinner from "@/components/ui/loadingSpinner"
import StarRating from "@/components/ui/starRating"
import { PageMessageContext } from "@/components/ui/pageMessages"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Person, UserSkill } from "@/Types"
import { useGetPeople } from "@/Helpers"
import { tableRowSliceAndFill } from "@/Helpers/utils"
import { getNumberIcon } from "@/Constants/NumberIcons"

const GetTopSkills = (skillsArray?: UserSkill[], topSkill?: UserSkill) =>
    skillsArray
        ?.filter((sk) => sk.id !== topSkill?.id)
        ?.toSorted((a, b) => (a.rating < b.rating ? 1 : -1))
        .splice(0, 3)

const PeoplePage = () => {
    const pageSize = 10
    const {
        isPending: pendingPeople,
        isLoading: loadingPeople,
        data: people,
        error,
    } = useGetPeople()
    const [pageResults, setPageResults] = useState<Person[]>([])
    const [page, setPage] = useState<number>(0)
    const [filterString, setFilterString] = useState<string>("")
    const { addPageError } = useContext(PageMessageContext)

    // TODO: need to add these thing to url params
    // - page number
    // - filter info
    const [filteredResults, setFilteredResults] = useState<Person[]>([])

    useEffect(() => {
        setFilteredResults(
            people?.filter((a) => {
                return a.name.toLowerCase().includes(filterString.toLowerCase())
            })
        )
    }, [filterString, people])

    useEffect(() => {
        const temp = tableRowSliceAndFill(filteredResults, page, pageSize, {
            id: "",
            name: "",
        } as Person)
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
            <div className="grid grid-cols-1 md:grid-cols-2 mb-4 md:mb-0 gap-y-4 border-0 md:border-b border-black items-center">
                <h1 className="text-xl font-bold px-2 py-4 text-white">People</h1>
                <div className="w-full items-center justify-end flex px-8 md:px-0">
                    <Label className="mr-4 min-w-min text-white font-bold text-xl">Search</Label>
                    <Input
                        id="person"
                        placeholder="Enter Name"
                        onChange={(e) => setFilterString(e.target.value)}
                    />
                </div>
            </div>
            <div className="mb-10">
                <Table className="text-white overflow-hidden">
                    <TableCaption className="text-gray-400">
                        A list of your tracked employees
                    </TableCaption>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="font-bold">Name</TableHead>
                            <TableHead className="font-bold hidden lg:table-cell">
                                Top Skills
                            </TableHead>
                            <TableHead className="font-bold flex items-center justify-end sm:justify-start sm:table-cell">
                                Top Skill
                            </TableHead>
                            {/* <TableHead className='font-bold hidden xl:table-cell'>
                            <div className='flex justify-end'>
                            Attitude
                            </div>
                        </TableHead> */}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pageResults.map(({ id, name, skills, topSkill }, peopleIndex) => (
                            <TableRow
                                key={id + ":" + peopleIndex}
                                className="hover:bg-gray-700 h-14"
                            >
                                <TableCell className="font-medium p-0 max-w-[200px] md:max-w-[300px]">
                                    <Link
                                        to={`/people/${id}`}
                                        className="p-4 hover:text-green-500 flex items-center"
                                    >
                                        <span className="mr-2">{name && <FaUser size={18} />}</span>
                                        <span className="mr-2 font-bold truncate">{name}</span>
                                    </Link>
                                </TableCell>
                                <TableCell className="p-0 hidden lg:table-cell">
                                    <div className="items-center grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-y-2">
                                        {GetTopSkills(skills, topSkill)?.map(
                                            ({ rating, name, id: skill_id }, index) => (
                                                <Link
                                                    to={`/skills/${skill_id}`}
                                                    key={skill_id + ":" + name}
                                                    className={`
                                                        px-4 py-1 m-3 hover:text-green-500 items-center
                                                        ${index == 0 ? "hidden md:grid" : ""}
                                                        ${index == 1 ? "hidden xl:grid" : ""}
                                                        ${index == 2 ? "hidden 2xl:grid" : ""}
                                                        border-l border-gray-600
                                                        `}
                                                >
                                                    <div className="flex gap-3 items-center justify-end sm:justify-start truncate">
                                                        <div
                                                            className={`hidden xl:flex items-center`}
                                                        >
                                                            {getNumberIcon(index, 26)}
                                                        </div>
                                                        <div
                                                            className={`flex items-baseline justify-end`}
                                                        >
                                                            <StarRating rating={rating} />
                                                        </div>
                                                        <div className="font-bold mr-1 truncate">
                                                            {name}
                                                        </div>
                                                    </div>
                                                </Link>
                                            )
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="p-0 w-max min-w-min">
                                    {topSkill?.id && (
                                        <Link
                                            to={`/skills/${topSkill?.id}`}
                                            className="px-4 py-2 m-2 gap-3 flex justify-end sm:justify-start items-center text-yellow-500 hover:text-green-500 border-0 sm:border-l border-gray-600"
                                        >
                                            {topSkill?.rating && (
                                                <span
                                                    className={`hidden sm:flex items-center gap-2 text-yellow-500`}
                                                >
                                                    <PiSealCheckBold size={25} />
                                                    <StarRating rating={topSkill.rating ?? 0} />
                                                </span>
                                            )}
                                            <span className="font-bold mr-1 truncate">
                                                {topSkill?.name}
                                            </span>
                                        </Link>
                                    )}
                                </TableCell>
                                {/* <TableCell className='p-0 hidden xl:table-cell items-center'>
                                <div className='flex justify-end mr-5'>
                                {getRandomSmileyFace()}
                                </div>
                            </TableCell> */}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Pager
                    current={page}
                    size={5}
                    setPage={setPage}
                    totalPages={Math.ceil(filteredResults.length / pageSize)}
                    resultsCount={filteredResults.length}
                />
            </div>
        </>
    )
}

export default PeoplePage
