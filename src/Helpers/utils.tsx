import { FaRegSmileWink, FaRegSmileBeam } from "react-icons/fa"

export const getRandomSmileyFace = () => {
    const faces = [FaRegSmileBeam, FaRegSmileWink]
    const number = Math.floor(Math.random() * faces.length)
    const FaceComp = faces[number]

    return <FaceComp className="text-green-600" size="32px" />
}

export const tableRowSliceAndFill = <T extends object>(
    array: T[],
    page: number,
    pageSize: number,
    blankObject?: T
) => {
    const temp = array.slice(page * pageSize, page * pageSize + pageSize)

    const emptyRows = []

    if (blankObject && temp.length < pageSize) {
        for (let i = 0; i < pageSize - temp.length; i++) {
            emptyRows.push(blankObject)
        }
    }

    return [...temp, ...emptyRows]
}

export const getInitials = (name?: string): string => {
    if (!name) return ""
    const nameArray = name.split(" ")
    const fInitial = nameArray?.[0]?.[0] || " "
    const lInitial = nameArray?.[1]?.[0] || " "
    return fInitial.toUpperCase() + lInitial.toUpperCase()
}

export const getNameFromEmail = (email: string) => email.split("@")[0]

export const getColor = (name: string) => {
    if (!name) {
        return "bg-green-700"
    }
    const colors = ["bg-blue-700", "bg-yellow-700", "bg-red-500", "bg-green-600", "bg-gray-500"]
    const charIndex = name.charCodeAt(0) - 65
    const colorIndex = charIndex % colors.length
    return colors[colorIndex]
}

export const formatPhone = (phoneNumber?: string) => {
    if (!phoneNumber) {
        return ""
    }
    const cleaned = ("" + phoneNumber).replace(/\D/g, "")
    const match = RegExp(/^(\d{3})(\d{3})(\d{4})$/).exec(cleaned)
    if (match) {
        return "(" + match[1] + ") " + match[2] + "-" + match[3]
    }
    return null
}

export const copyToClipboard = (stringToCopy?: string) =>
    stringToCopy && navigator.clipboard.writeText(stringToCopy)
