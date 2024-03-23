import { ImSpinner9 } from "react-icons/im";

const LoadingSpinner = () =>
    <div className='flex justify-center h-full text-white align-bottom'>
        <ImSpinner9 className='text-green-600 animate-spin my-20' size='100px' />
    </div>

export default LoadingSpinner
