import { useContext, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useGetPeople, useGetSkill } from "@/Helpers"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import StarRating from "@/components/ui/starRating"
import LoadingSpinner from "@/components/ui/loadingSpinner"
import { PageErrorsContext } from "@/components/ui/error"

const SkillPage = () => {
    const { id } = useParams()
    const { isPending: pendingSkill, isLoading: loadingSkill, data: skill, error: skillError } = useGetSkill(id ?? '')
    const { isPending: pendingPeople, isLoading: loadingPeople, data: people, error: peopleError } = useGetPeople()
    const { addPageError } = useContext(PageErrorsContext)
    const navigate = useNavigate()
    // TODO: possible reconfigure getPeople to accept a list of skills to query against

    const people_with_skill = people.map(p => {
        const userSkill = p.skills.find(ps => ps.id == skill.id)
        return {
            rating: userSkill?.rating ?? 0,
            user: p.name,
            userId: p.id
        }
    }).toSorted((a, b) => (a.rating ?? 0) < (b.rating ?? 0) ? 1 : -1)

    useEffect(() => {
        if (skillError?.message) {
            addPageError({ message: skillError.message, code: skillError.code })
        }
        if (peopleError?.message) {
            addPageError({ message: peopleError.message, code: peopleError.code })
        }
    }, [addPageError, peopleError, skillError])

    if (pendingSkill || loadingSkill || pendingPeople || loadingPeople) {
        return <LoadingSpinner />
    }

    return (
        <div>
            <div className='pt-10'>
                <div className='text-4xl text-white font-bold mb-2'>
                    {skill.name}
                </div>
                <div className='text-lg text-white mb-2'>
                    {skill.description}
                </div>
            </div>
            <Table>
                <TableHeader>
                    <TableRow className='hover:bg-transparent'>
                        <TableHead className='text-lg font-semibold'>User</TableHead>
                        <TableHead className='text-lg font-semibold'>Rating</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {people_with_skill.map(({ user, rating, userId }) =>
                        <TableRow className='text-white hover:text-blue-500 hover:cursor-pointer transition hover:bg-gray-700' onClick={() => navigate(`/people/${userId}`)} key={userId}>
                            <TableCell className='font-bold text-xl'>
                                {user}
                            </TableCell>
                            <TableCell>
                                <StarRating rating={rating} />
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default SkillPage
