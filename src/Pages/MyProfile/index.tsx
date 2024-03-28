import React, { useCallback, useContext, useEffect, useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { IoMdSettings } from "react-icons/io"
import { LoginButton } from "@/components/ui/navigation"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PageMessageContext } from "@/components/ui/pageMessages"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Person } from "@/Types"
import { useGetPersonManual, useUpdatePerson } from "@/Helpers"
import { getColor, getInitials } from "@/Helpers/utils"

type fieldType = string | number | undefined

type TableFormCellProps = {
    isEditing?: boolean
    value: fieldType
    setValue: (value: fieldType) => void
}

const TableFormCell: React.FC<TableFormCellProps> = ({ isEditing, setValue, value }) => {
    if (isEditing) {
        return (
            <TableCell className="p-2">
                <Input
                    className="text-black"
                    onChange={(e) => setValue(e.target.value)}
                    value={value}
                />
            </TableCell>
        )
    }
    return <TableCell>{value ?? "None"}</TableCell>
}

type MyProfileProps = {
    user: Person
    loading: boolean
    updatePerson: (person: Person) => Promise<void>
    fetchPerson: () => void
}

const MyProfile: React.FC<MyProfileProps> = ({ user, loading, updatePerson, fetchPerson }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [name, setName] = useState<fieldType>(user.name)
    const [phone, setPhone] = useState<fieldType>(user.phone)
    const [email, setEmail] = useState<fieldType>(user.email)

    useEffect(() => {
        setName(user.name)
        setPhone(user.phone)
        setEmail(user.email)
    }, [user.email, user.name, user.phone])

    const _setEditing = useCallback(() => {
        if (!isEditing) {
            setIsEditing(true)
            return
        }
        setIsEditing(false)
        updatePerson({ name, phone, email } as Person).then(() => {
            fetchPerson()
        })
    }, [email, isEditing, name, phone, updatePerson, fetchPerson])

    if (loading) {
        return (
            <div className="font-bold text-white text-3xl min-w-max absolute h-max inset-1/2 -translate-x-1/2 -translate-y-1/2">
                Fetching User...
            </div>
        )
    }

    return (
        <div>
            <div className="py-4 px-2 grid grid-cols-3 lg:grid-cols-4 items-end gap-y-8">
                <div className="text-xl text-white font-bold flex gap-4 items-center col-span-3">
                    <Avatar className="w-[70px] h-[70px]">
                        <AvatarImage />
                        <AvatarFallback className={`${getColor(user.name)} text-3xl`}>
                            {getInitials(user.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div>{user.name} - Your Profile</div>
                </div>
                {isEditing ? (
                    <div className="col-span-3 lg:col-span-1 grid grid-cols-2 gap-4 w-full">
                        <Button onClick={_setEditing} className="bg-green-600 text-lg font-bold">
                            Confirm
                        </Button>
                        <Button
                            onClick={() => setIsEditing(false)}
                            className="bg-red-600 hover:bg-red-800 darken text-lg font-bold"
                        >
                            Cancel
                        </Button>
                    </div>
                ) : (
                    <div className="col-span-3 lg:col-span-1 w-full flex justify-end">
                        <Button
                            onClick={_setEditing}
                            className="w-1/2 bg-green-600 text-lg font-bold gap-2 flex items-center"
                        >
                            <IoMdSettings />
                            Edit
                        </Button>
                    </div>
                )}
            </div>
            <Table>
                <TableBody className="text-white border-y border-gray-700 text-lg font-bold">
                    <TableRow>
                        <TableCell className="w-1/2">Name</TableCell>
                        <TableFormCell isEditing={isEditing} value={name} setValue={setName} />
                    </TableRow>
                    <TableRow>
                        <TableCell className="w-1/2">Email</TableCell>
                        <TableFormCell isEditing={isEditing} value={email} setValue={setEmail} />
                    </TableRow>
                    <TableRow>
                        <TableCell className="w-1/2">Phone</TableCell>
                        <TableFormCell isEditing={isEditing} value={phone} setValue={setPhone} />
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}

const PageMyProfile = () => {
    const { addPageError } = useContext(PageMessageContext)
    const { isAuthenticated, isLoading: isLoadingAuth, user: authUser } = useAuth0()
    const {
        isLoading: isLoadingUser,
        data: user,
        error: userError,
        fetch: fetchUser,
    } = useGetPersonManual(authUser?.sub ?? "")

    const {
        post: updatePerson,
        isLoading: postLoading,
        error: postError,
    } = useUpdatePerson(user.id)

    useEffect(() => {
        fetchUser()
    }, [fetchUser])

    useEffect(() => {
        if (userError?.message) {
            addPageError({ message: userError.message, code: userError.code })
        }
        if (postError?.message) {
            addPageError({ message: postError.message, code: postError.code })
        }
    }, [addPageError, postError, userError])

    if (isLoadingAuth || isLoadingUser) {
        return (
            <div className="font-bold text-white text-3xl min-w-max absolute h-max inset-1/2 -translate-x-1/2 -translate-y-1/2">
                Logging in...
            </div>
        )
    }

    if (!isAuthenticated) {
        return (
            <div className="font-bold text-xl md:text-3xl text-white text-center h-max mt-56">
                <div className="flex mb-10 justify-center break-words">
                    Please login to continue
                </div>
                <div className="flex justify-center">
                    <LoginButton />
                </div>
            </div>
        )
    }

    return (
        <MyProfile
            loading={postLoading}
            user={user}
            updatePerson={updatePerson}
            fetchPerson={fetchUser}
        />
    )
}

export default PageMyProfile
