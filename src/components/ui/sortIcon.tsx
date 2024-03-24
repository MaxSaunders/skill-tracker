import { FaSortDown, FaSortUp } from "react-icons/fa6";

interface SortIconProps {
    sort?: string | null,
    isAsc: boolean,
    sortName: string
}

const SortIcon: React.FC<SortIconProps> = ({ sort, isAsc, sortName }) => {
    if (sort !== sortName) {
        return (
            <></>
        )
    }
    return (
        <>
            {isAsc ? <FaSortDown /> : <FaSortUp />}
        </>
    )
}

export default SortIcon
