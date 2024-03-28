import { useCallback, useContext, useEffect, useState } from "react"
import { MdLibraryAdd } from "react-icons/md"
import { useAuth0 } from "@auth0/auth0-react"
import axios from "axios"
import {
    Table,
    TableBody,
    TableCaption,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Pager from "@/components/ui/pager"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import LoadingSpinner from "@/components/ui/loadingSpinner"
import { PageMessageContext } from "@/components/ui/pageMessages"
import { NewSkillObj, Skill } from "@/Types"
import { useGetPeople, useGetSkills } from "@/Helpers"
import NewSkillForm from "./newSkillForm"
import SkillRow from "./skillRow"
import { tableRowSliceAndFill } from "@/Helpers/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const API_URL = import.meta.env.VITE_API_URL

const SkillsPage = () => {
    const { isAuthenticated } = useAuth0()

    const pageSize = 10
    const [page, setPage] = useState<number>(0)
    // TODO: need to add these thing to url params
    // - page number
    // - filter info
    const [paginatedResults, setPaginatedResults] = useState<Skill[]>([])
    const [filteredResults, setFilteredResults] = useState<Skill[]>([])
    const [filter, setFilter] = useState<string>("")
    // TODO: change to useFilterSort()
    const { addPageError } = useContext(PageMessageContext)

    const {
        isPending: pendingSkills,
        isLoading: loadingSkills,
        data: skills,
        error: skillsError,
        refetch: refetchSkills,
    } = useGetSkills()
    const {
        isPending: pendingPeople,
        isLoading: loadingPeople,
        data: people,
        error: peopleError,
    } = useGetPeople()

    const addSkill = useCallback(async (skill: NewSkillObj) => {
        return await axios.post(API_URL + "/skills/new", skill)
    }, [])

    const [addingNew, setAddingNew] = useState(false)
    const validateName = useCallback(
        (newName: string) =>
            skills.find((s) => s.name.toLowerCase() === newName.toLowerCase())
                ? "Skill already exists"
                : undefined,
        [skills]
    )
    const onSubmit = useCallback(
        (data: NewSkillObj) => {
            addSkill(data).then(() => {
                refetchSkills()
            })
            setAddingNew(false)
        },
        [addSkill, refetchSkills]
    )

    useEffect(() => {
        setFilteredResults(
            skills.filter(
                (s) =>
                    s.name.toLowerCase().includes(filter.toLowerCase()) ||
                    s.description.toLowerCase().includes(filter.toLowerCase())
            )
        )
    }, [filter, skills])

    useEffect(() => {
        const sortedAndFiltered = tableRowSliceAndFill(
            filteredResults.toSorted((a, b) => a.name.localeCompare(b.name)),
            page,
            pageSize,
            {} as Skill
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
            <Dialog open={isAuthenticated && addingNew} onOpenChange={(e) => setAddingNew(e)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Skill</DialogTitle>
                        <NewSkillForm
                            onSubmit={onSubmit}
                            validateName={validateName}
                            close={() => setAddingNew(false)}
                        />
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            <div className="mb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 mb-4 md:mb-0 gap-y-4 items-center border-0 md:border-b border-black">
                    <h1 className="text-xl font-bold px-2 py-4 text-white">Skills</h1>
                    <span className="grid grid-cols-4 gap-x-5 items-end">
                        <span
                            className={`${
                                isAuthenticated
                                    ? "col-span-4 sm:col-span-3"
                                    : "col-span-3 md:col-span-4"
                            } mb-2 sm:mb-0 sm:flex items-center`}
                        >
                            <Label className="mr-4 font-bold text-white text-xl">Search</Label>
                            <Input
                                placeholder="Enter Skill Name"
                                onChange={(e) => setFilter(e.target.value)}
                            />
                        </span>
                        {isAuthenticated && (
                            <Button
                                className="col-span-4 sm:col-span-1 order-last bg-green-600 font-bold flex items-center gap-2"
                                onClick={() => setAddingNew(true)}
                            >
                                Add New
                                <MdLibraryAdd size={20} />
                            </Button>
                        )}
                    </span>
                </div>

                <Table className="text-white">
                    <TableCaption>A list of your company's tracked competencies</TableCaption>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="font-bold w-[100px]">Skill</TableHead>
                            <TableHead className="font-bold hidden xl:table-cell ">
                                Description
                            </TableHead>
                            <TableHead className="font-bold text-right sm:text-left">
                                Top Users
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedResults.map((skill, skillIndex) => (
                            <SkillRow
                                key={skill.id + ":" + skillIndex}
                                skill={skill}
                                people={people}
                            />
                        ))}
                    </TableBody>
                </Table>
                <Pager
                    current={page}
                    setPage={setPage}
                    totalPages={Math.ceil(filteredResults.length / pageSize)}
                    resultsCount={filteredResults.length}
                />
            </div>
        </>
    )
}

export default SkillsPage
