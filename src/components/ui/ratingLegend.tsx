import StarRating from '@/components/ui/starRating'

const RatingLegend = () =>
    <span className='py-2'>
        <span className='grid grid-cols-2 items-center hover:bg-gray-900 px-2'><StarRating rating={1} showAll={false} /> Heard of it&nbsp;&nbsp;</span>
        <span className='grid grid-cols-2 items-center hover:bg-gray-900 px-2'><StarRating rating={2} showAll={false} /> Used it&nbsp;&nbsp;</span>
        <span className='grid grid-cols-2 items-center hover:bg-gray-900 px-2'><StarRating rating={3} showAll={false} /> Worked with it in PROD&nbsp;&nbsp;</span>
        <span className='grid grid-cols-2 items-center hover:bg-gray-900 px-2'><StarRating rating={4} showAll={false} /> Im an Expert&nbsp;&nbsp;</span>
    </span>

export default RatingLegend