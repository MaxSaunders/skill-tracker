import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { FaStar } from "react-icons/fa"
import { useAuth0 } from "@auth0/auth0-react"
import { PageMessageContext } from "@/components/ui/pageMessages"
import { ratingColorHash } from "@/Constants/Colors"

interface SkillRatingsProps {
    id: string
    initialRating: number
    updateAndFetch: (userId: string, skillId: string, rating: number) => void
    colors?: boolean
}

const SkillRatings: React.FC<SkillRatingsProps> = ({
    id,
    initialRating,
    updateAndFetch,
    colors = true,
}) => {
    const { user } = useAuth0()
    const [rating, setRating] = useState(initialRating)
    // for some reason this is not being set correctly
    const [hovered, setHovered] = useState<number>(0)
    const { addPageError } = useContext(PageMessageContext)

    const className = useMemo(() => "hover:cursor-pointer mx-0.5", [])
    const comparisonValue = useMemo(() => hovered || rating, [hovered, rating])

    useEffect(() => {
        // For some reason rating is not being set as a default value
        setRating(initialRating)
    }, [initialRating])

    const updateRating = useCallback(
        (newRating: number) => () => {
            if (user?.sub) {
                setRating(newRating)
                updateAndFetch(user.sub, id, newRating)
            } else {
                addPageError({
                    code: 500,
                    message: "Cannot update rating without auth user id",
                    id: "",
                })
            }

            return undefined
        },
        [addPageError, id, updateAndFetch, user]
    )

    const color = useCallback(
        (starNumber: number) => {
            if (comparisonValue < starNumber) {
                return colors ? ratingColorHash[0] : "text-white"
            }
            // return colors ? ratingColorHash[comparisonValue] : "text-yellow-500"
            return "text-yellow-600"
        },
        [colors, comparisonValue]
    )

    const activeHover = useCallback(
        (starNumber: number) => {
            if (hovered === starNumber) {
                return "scale-150"
            }
            return ""
        },
        [hovered]
    )

    return (
        <div className="flex" onMouseLeave={() => setHovered(0)}>
            <FaStar
                size="18px"
                onMouseEnter={() => setHovered(1)}
                onClick={updateRating(1)}
                className={`${className} ${activeHover(1)} ${color(1)}`}
            />
            <FaStar
                size="18px"
                onMouseEnter={() => setHovered(2)}
                onClick={updateRating(2)}
                className={`${className} ${activeHover(2)} ${color(2)}`}
            />
            <FaStar
                size="18px"
                onMouseEnter={() => setHovered(3)}
                onClick={updateRating(3)}
                className={`${className} ${activeHover(3)} ${color(3)}`}
            />
            <FaStar
                size="18px"
                onMouseEnter={() => setHovered(4)}
                onClick={updateRating(4)}
                className={`${className} ${activeHover(4)} ${color(4)}`}
            />
        </div>
    )
}

export default SkillRatings
