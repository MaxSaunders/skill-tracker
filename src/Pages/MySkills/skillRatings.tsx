import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { FaStar } from "react-icons/fa"
import { useAuth0 } from "@auth0/auth0-react"
import { PageErrorsContext } from '@/components/ui/error';
import { ratingColorHash } from '@/Constants/Colors';

interface SkillRatingsProps {
    id: string;
    initialRating: number;
    updateAndFetch: (userId: string, skillId: string, rating: number) => void
}

const SkillRatings: React.FC<SkillRatingsProps> = ({ id, initialRating, updateAndFetch }) => {
    const { user } = useAuth0();
    const [rating, setRating] = useState(initialRating)
    // for some reason this is not being set correctly
    const [hovered, setHovered] = useState<number>(0)
    const { addPageError } = useContext(PageErrorsContext)

    const className = useMemo(() => 'hover:cursor-pointer mx-0.5', [])
    const comparisonValue = useMemo(() => hovered || rating, [hovered, rating])

    useEffect(() => {
        // For some reason rating is not being set as a default value
        setRating(initialRating)
    }, [initialRating])

    const updateRating = useCallback((newRating: number) => () => {
        if (user?.sub) {
            setRating(newRating)
            updateAndFetch(user.sub, id, newRating)
        } else {
            addPageError({ code: 500, message: 'Cannot update rating without auth user id', id: '' })
        }

        return undefined
    }, [addPageError, id, updateAndFetch, user])

    const color = useCallback((starNumber: number) => {
        if (comparisonValue < starNumber) {
            return ratingColorHash[0]
        }
        return ratingColorHash[comparisonValue]
    }, [comparisonValue])

    return (
        <div className='flex' onMouseLeave={() => setHovered(0)}>
            <FaStar size='1.5rem' onMouseEnter={() => setHovered(1)} onClick={updateRating(1)} className={`${className} ${color(1)}`} />
            <FaStar size='1.5rem' onMouseEnter={() => setHovered(2)} onClick={updateRating(2)} className={`${className} ${color(2)}`} />
            <FaStar size='1.5rem' onMouseEnter={() => setHovered(3)} onClick={updateRating(3)} className={`${className} ${color(3)}`} />
            <FaStar size='1.5rem' onMouseEnter={() => setHovered(4)} onClick={updateRating(4)} className={`${className} ${color(4)}`} />
        </div>
    )
}

export default SkillRatings
