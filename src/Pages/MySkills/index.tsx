import { useCallback, useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth0 } from "@auth0/auth0-react"
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
import { LoginButton } from "@/components/ui/navigation"
import LoadingSpinner from "@/components/ui/loadingSpinner"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import SortIcon from "@/components/ui/sortIcon"
import { PageMessageContext } from "@/components/ui/pageMessages"
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { updateTopSkill, useGetPersonManual, useGetSkills, updatePersonSkill } from "@/Helpers"
import useFilterSort from "@/Helpers/useFIlterSort"
import RatingLegend from "@/components/ui/ratingLegend"
import { UserSkill, Skill } from "@/Types"
import { tableRowSliceAndFill } from "@/Helpers/utils"
import SkillRatings from "./skillRatings"

const MySkillsComponents = () => {
    const { user: authUser } = useAuth0()
    const pageSize = 10
    const [page, setPage] = useState<number>(0)
    const [paginatedResults, setPaginatedResults] = useState<UserSkill[]>([])
    const { addPageError } = useContext(PageMessageContext)
    const [sortedSkills, setSortedSkills] = useState<UserSkill[]>([])
    const { sort, sortFunction, changeSort, filter, setFilter, filterFunction, isAsc } =
        useFilterSort<UserSkill>({ sort: "rating" })

    const {
        isPending: pendingSkills,
        isLoading: loadingSkills,
        data: skills,
        error: skillsError,
    } = useGetSkills()
    const {
        isLoading: isLoadingUser,
        data: user,
        error: userError,
        fetch: fetchUser,
    } = useGetPersonManual(authUser?.sub ?? "")
    const topSkill = user?.topSkill

    useEffect(() => {
        fetchUser()
    }, [fetchUser])

    useEffect(() => {
        if (user) {
            const usersSkills = skills.map((sk: Skill) => {
                const userSkill = user?.skills?.find((us: UserSkill) => us.id === sk.id)

                return {
                    ...sk,
                    rating: userSkill?.rating ?? 0,
                }
            })
            setSortedSkills(usersSkills?.filter(filterFunction("name")).toSorted(sortFunction))
        } else {
            setSortedSkills([])
        }
    }, [skills, sort, filter, user, filterFunction, sortFunction])

    useEffect(() => {
        setPaginatedResults(tableRowSliceAndFill(sortedSkills, page, pageSize, {} as UserSkill))
    }, [pageSize, page, user, sortedSkills])

    const _updateTopSkill = useCallback(
        (newTopSkillId: string) => {
            updateTopSkill(authUser?.sub ?? "", newTopSkillId).then(() => {
                fetchUser()
            })
        },
        [authUser?.sub, fetchUser]
    )

    const _updateAndFetch = useCallback(
        (userId: string, skillId: string, newRating: number) => {
            updatePersonSkill(userId, skillId, newRating).then(() => {
                fetchUser()
            })
        },
        [fetchUser]
    )

    useEffect(() => {
        if (skillsError?.message) {
            addPageError({ message: skillsError.message, code: skillsError.code })
        }
        if (userError?.message) {
            addPageError({ message: userError.message, code: userError.code })
        }
    }, [addPageError, userError, skillsError])

    if (loadingSkills || pendingSkills || (isLoadingUser && !user)) {
        return <LoadingSpinner />
    }

    return (
        <>
            <div className="flex justify-between items-center font-bold text-white border-b border-black">
                <h1 className="px-2 py-4 text-xl">My Skills - {user?.name}</h1>
                <div className="hidden lg:flex">
                    <RatingLegend />
                </div>
            </div>
            <div className="grid gap-y-8 gap-x-10 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 justify-between text-white pb-8 pt-4 px-3 font-semibold text-lg">
                <div className="grid grid-cols-2 lg:grid-col-3 items-center-3">
                    <span className="flex items-center">
                        {/* <PiSealCheckBold className="text-yellow-600 mr-2" size="24px" /> */}
                        Top Skill:
                    </span>
                    {topSkill?.name && (
                        <Link
                            to={"/skills/" + topSkill?.id}
                            className="hover:scale-110 hover:bg-gray-900 px-5 py-2 rounded text-yellow-500 w-100 flex justify-center items-center"
                        >
                            <PiSealCheckBold className="text-yellow-600 mr-2" size={25} />
                            {topSkill?.name}
                        </Link>
                    )}
                </div>
                <div className="hidden xl:block 2xl:col-span-2" />
                <div className="flex items-center">
                    <Label className="mr-3 text-lg">Search</Label>
                    <Input
                        className="text-black"
                        placeholder="Enter Skill Name"
                        onChange={(e) => setFilter(e.target.value)}
                        value={filter}
                    />
                </div>
            </div>
            <div className="mb-10">
                <Table className="text-white">
                    <TableCaption>A list of your personal tracked competencies</TableCaption>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="font-bold w-[200px]">
                                <div
                                    onClick={() => changeSort("name", false)}
                                    className="hover:cursor-pointer hover:text-green-500 flex items-center"
                                >
                                    Skill&nbsp;&nbsp;
                                    <SortIcon sortName="name" isAsc={isAsc} sort={sort} />
                                </div>
                            </TableHead>
                            <TableHead className="font-bold w-[200px]">
                                <div
                                    onClick={() => changeSort("rating")}
                                    className="hover:cursor-pointer hover:text-green-500 flex items-center"
                                >
                                    My Rating&nbsp;&nbsp;
                                    <SortIcon sortName="rating" isAsc={isAsc} sort={sort} />
                                </div>
                            </TableHead>
                            <TableHead className="font-bold hidden lg:table-cell">
                                Description
                            </TableHead>
                            <TableHead />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedResults.map(({ id, name, description, rating }, skillIndex) => (
                            <TableRow
                                key={id + ":" + skillIndex}
                                className="hover:bg-gray-700 h-14"
                            >
                                <TableCell className="font-medium">
                                    <Link
                                        to={"/skills/" + id}
                                        className="text-left w-100 block hover:text-green-500 hover:font-bold"
                                    >
                                        {name}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    {id && (
                                        <SkillRatings
                                            id={id}
                                            initialRating={rating}
                                            updateAndFetch={_updateAndFetch}
                                        />
                                    )}
                                </TableCell>
                                <TableCell className="hidden lg:table-cell">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <div className="text-left">{description}</div>
                                            </TooltipTrigger>
                                            <TooltipContent>{description}</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </TableCell>
                                <TableCell className="py-0 items-center">
                                    <div className="flex justify-end">
                                        {id && topSkill?.id !== id && (
                                            <Button
                                                onClick={() => _updateTopSkill(id)}
                                                className="bg-color-transparent p-0 block h-full"
                                            >
                                                <span className="hidden md:flex items-center py-2 px-3 text-green-500">
                                                    <PiSealCheckBold size="24px" className="mr-2" />
                                                    Set Top Skill
                                                </span>
                                                <span className="block md:hidden p-2 text-green-500">
                                                    <PiSealCheckBold size="24px" />
                                                </span>
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Pager
                    current={page}
                    setPage={setPage}
                    totalPages={Math.ceil(sortedSkills.length / pageSize)}
                    resultsCount={sortedSkills.length}
                />
            </div>
        </>
    )
}

const MySkillsPage = () => {
    const { isAuthenticated, isLoading: isLoadingAuth } = useAuth0()

    if (isLoadingAuth) {
        return (
            <div className="font-bold text-white text-3xl min-w-max absolute h-max inset-1/2 -translate-x-1/2 -translate-y-1/2">
                Logging in...
            </div>
        )
    }

    if (!isAuthenticated) {
        return (
            <div className="font-bold text-xl md:text-3xl text-white text-center h-max mt-56">
                <div className="flex mb-10 justify-center break-words">
                    Please login to continue
                </div>
                <div className="flex justify-center">
                    <LoginButton />
                </div>
            </div>
        )
    }

    return <MySkillsComponents />
}

export default MySkillsPage
