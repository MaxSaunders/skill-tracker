import React, { useCallback, useContext, useEffect, useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { IoMdSettings } from "react-icons/io"
import { LoginButton } from "@/components/ui/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PageMessageContext } from "@/components/ui/pageMessages"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Person } from "@/Types"
import { useGetPersonManual, useUpdatePerson } from "@/Helpers"
import { getColor, getInitials } from "@/Helpers/utils"
import { useForm } from "react-hook-form"

type fieldType = string | number | undefined

type MyProfileProps = {
    user: Person
    loading: boolean
    updatePerson: (person: Person) => Promise<void>
    fetchPerson: () => void
}

const MyProfile: React.FC<MyProfileProps> = ({ user, loading, updatePerson, fetchPerson }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [initialName, setInitialName] = useState<fieldType>(user.name)
    const [initialPhone, setInitialPhone] = useState<fieldType>(user.phone)
    const [initialEmail, setInitialEmail] = useState<fieldType>(user.email)

    const cancel = () => {
        setIsEditing(false)
        reset()
    }

    useEffect(() => {
        setInitialName(user.name)
        setInitialPhone(user.phone)
        setInitialEmail(user.email)
    }, [user.email, user.name, user.phone])

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<Person>({
        defaultValues: { name: user.name, email: user.email, phone: user.phone },
    })

    const validateName = (s?: string) => {
        if (!s?.length) return "Input required"
        return s.length < 40 ? undefined : "Input too long"
    }
    const validatePhone = (s?: string) => {
        if (!s?.length) return "Input required"
        if (s.length !== 10) return "Input incorrect length"
        if (RegExp(/\D/).exec(s)) return "Only numerics are allowed"
        return undefined
    }
    const validateEmail = (s?: string) => {
        if (!s?.length) return "Input required"
        return RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/).exec(
            s.toLowerCase()
        )
            ? undefined
            : "Input invalid"
    }

    const onSubmit = useCallback(
        ({ name = "", phone = "", email = "" }) => {
            setIsEditing(false)
            updatePerson({
                name: name ?? initialName,
                phone: phone ?? initialPhone,
                email: email ?? initialEmail,
            } as Person).then(() => {
                fetchPerson()
            })
        },
        [initialName, initialPhone, initialEmail, updatePerson, fetchPerson]
    )

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
                    <div className="flex gap-2">
                        <div className="hidden md:block">{user.name}</div>
                        <div className="hidden md:block">-</div>
                        <div>Your Profile</div>
                    </div>
                </div>
                {isEditing ? (
                    <div className="col-span-3 lg:col-span-1 grid grid-cols-2 gap-4 w-full">
                        <Button
                            onClick={handleSubmit(onSubmit)}
                            className="bg-green-600 text-lg font-bold"
                        >
                            Confirm
                        </Button>
                        <Button
                            type="button"
                            onClick={cancel}
                            className="bg-red-600 hover:bg-red-800 darken text-lg font-bold"
                        >
                            Cancel
                        </Button>
                    </div>
                ) : (
                    <div className="col-span-3 lg:col-span-1 w-full flex justify-end">
                        <Button
                            onClick={() => setIsEditing(true)}
                            className="w-full sm:w-1/2 bg-green-600 text-lg font-bold gap-2 flex items-center"
                        >
                            <IoMdSettings />
                            Edit
                        </Button>
                    </div>
                )}
            </div>
            <div className="grid divide-y divide-gray-700 text-white border-y border-gray-700 text-lg font-bold">
                <div className="grid grid-cols-1 md:grid-cols-2 p-2 truncate">
                    <div className={`flex items-center ${errors?.name ? "text-color-500" : ""}`}>
                        <div className="p-2 gap-1">Name</div>
                        {isEditing && (
                            <span className="text-red-500">
                                {errors?.name && "*"} {errors?.name?.message}
                            </span>
                        )}
                    </div>
                    {isEditing ? (
                        <div className="flex items-center">
                            <Input
                                className="text-black"
                                {...register("name", { validate: validateName })}
                            />
                        </div>
                    ) : (
                        <div className="p-2 truncate">{initialName ?? "None"}</div>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 p-2 truncate">
                    <div className={`flex items-center ${errors?.email ? "text-color-500" : ""}`}>
                        <div className="p-2 gap-1">Email</div>
                        {isEditing && (
                            <span className="text-red-500">
                                {errors?.email && "*"} {errors?.email?.message}
                            </span>
                        )}
                    </div>
                    {isEditing ? (
                        <div className="flex items-center">
                            <Input
                                className="text-black"
                                {...register("email", { validate: validateEmail })}
                            />
                        </div>
                    ) : (
                        <div className="p-2 truncate">{initialEmail ?? "None"}</div>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 p-2 truncate">
                    <div className={`flex items-center ${errors?.phone ? "text-color-500" : ""}`}>
                        <div className="p-2 gap-1">Phone</div>
                        {isEditing && (
                            <span className="text-red-500">
                                {errors?.phone && "*"} {errors?.phone?.message}
                            </span>
                        )}
                    </div>
                    {isEditing ? (
                        <div className="flex items-center">
                            <Input
                                className="text-black"
                                {...register("phone", { validate: validatePhone })}
                            />
                        </div>
                    ) : (
                        <div className="p-2 truncate">{initialPhone ?? "None"}</div>
                    )}
                </div>
            </div>
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
