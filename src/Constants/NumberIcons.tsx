import {
    TbSquareRoundedNumber1,
    TbSquareRoundedNumber2,
    TbSquareRoundedNumber3,
    TbSquareRoundedNumber4,
    TbSquareRoundedNumber5,
    TbSquareRoundedNumber6,
    TbSquareRoundedNumber7,
    TbSquareRoundedNumber8,
    TbSquareRoundedNumber9,
} from "react-icons/tb"

export const numberIconArray = [
    TbSquareRoundedNumber1,
    TbSquareRoundedNumber2,
    TbSquareRoundedNumber3,
    TbSquareRoundedNumber4,
    TbSquareRoundedNumber5,
    TbSquareRoundedNumber6,
    TbSquareRoundedNumber7,
    TbSquareRoundedNumber8,
    TbSquareRoundedNumber9,
]

export const getNumberIcon = (index: number, size = 20) => {
    const Icon = numberIconArray[index % numberIconArray.length]
    return <Icon key={index} size={size} />
}
