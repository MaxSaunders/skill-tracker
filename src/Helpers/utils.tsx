import { FaRegSmileWink, FaRegSmileBeam } from "react-icons/fa";

export const getRandomSmileyFace = () => {
    const faces = [FaRegSmileBeam, FaRegSmileWink]
    const number = Math.floor(Math.random() * faces.length);
    const FaceComp = faces[number]

    return <FaceComp className='text-green-600' size='2rem' />
}

export const tableRowSliceAndFill = <T extends object>(array: T[], page: number, pageSize: number, blankObject?: T) => {
    const temp = array.slice(page * pageSize, (page * pageSize) + pageSize)

    const emptyRows = []

    if (blankObject && (temp.length < pageSize)) {
        for (let i = 0; i < (pageSize - temp.length); i++) {
            emptyRows.push(blankObject)
        }
    }

    return [...temp, ...emptyRows]
}