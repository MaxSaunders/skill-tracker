// import { ratingColorHash } from "@/Constants/Colors"
import { FaStar } from "react-icons/fa"
import { v4 as gen_uuid } from "uuid"

interface StarRatingProps {
    rating: number
    showAll?: boolean
    size?: number
}

const StarRating: React.FC<StarRatingProps> = ({ rating, showAll = true, size = 16 }) => {
    const countArray = [...Array(rating)].map(() => ({
        rating,
        id: gen_uuid(),
    }))
    const color = "text-yellow-600"
    // const color = ratingColorHash[rating]

    if (showAll) {
        return (
            <span className="flex gap-1">
                <span className={`${rating >= 1 ? color : "text-white"}`}>
                    <FaStar size={size} />
                </span>
                <span className={`${rating >= 2 ? color : "text-white"}`}>
                    <FaStar size={size} />
                </span>
                <span className={`${rating >= 3 ? color : "text-white"}`}>
                    <FaStar size={size} />
                </span>
                <span className={`${rating >= 4 ? color : "text-white"}`}>
                    <FaStar size={size} />
                </span>
            </span>
        )
    }

    return (
        <span className={`flex ${color}`}>
            {countArray.map(({ id }) => (
                <span className="mr-1" key={id}>
                    <FaStar size="21px" />
                </span>
            ))}
        </span>
    )
}

export default StarRating
