import { ratingColorHash } from "@/Constants/Colors"
import { FaStar } from "react-icons/fa"


interface StarRatingProps {
    rating: number,
    showAll?: boolean
}

const StarRating: React.FC<StarRatingProps> = ({ rating, showAll = true }) => {
    const countArray = [...Array(rating)]
    const color = ratingColorHash[rating]

    if (showAll) {
        return (
            <span className='flex'>
                <span className={`mr-1 ${rating >= 1 ? color : 'text-white'}`}>
                    <FaStar size='1.3rem' />
                </span>
                <span className={`mr-1 ${rating >= 2 ? color : 'text-white'}`}>
                    <FaStar size='1.3rem' />
                </span>
                <span className={`mr-1 ${rating >= 3 ? color : 'text-white'}`}>
                    <FaStar size='1.3rem' />
                </span>
                <span className={`mr-1 ${rating >= 4 ? color : 'text-white'}`}>
                    <FaStar size='1.3rem' />
                </span>
            </span>
        )
    }

    return (
        <span className={`flex ${color}`}>
            {countArray.map((_, index) =>
                <span className='mr-1' key={index} >
                    <FaStar size='1.3rem' />
                </span>
            )}
        </span>
    )
}

export default StarRating
