import { Link, useLocation } from "react-router-dom"
import { ReactNode, useContext, useEffect, useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { CgMenu } from "react-icons/cg"
import { IoIosLogOut, IoIosLogIn } from "react-icons/io"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"

import {
    Drawer,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

import { Button } from "@/components/ui/button"
import { useRegisterPerson } from "@/Helpers"
import { PageMessageContext } from "./pageMessages"
import { useMediaQuery } from "@/Helpers/useMediaQuery"
import logo from "../../img/logo-inverse.svg"

const AUTH0_CALLBACK_URL = import.meta.env.VITE_AUTH0_CALLBACK_URL

const buttons = [
    { label: "Home", to: "/" },
    { label: "People", to: "/people" },
    { label: "Skills", to: "/skills" },
    { label: "My Skills", to: "/my-skills" },
    { label: "My Profile", to: "/my-profile" },
]

export const LoginButton = () => {
    const { loginWithPopup } = useAuth0()

    return (
        <Button className="bg-green-600 font-bold text-lg px-8" onClick={() => loginWithPopup()}>
            <span className="mr-2 items-center flex">Log In</span>
            <IoIosLogIn size={20} />
        </Button>
    )
}

export const LogoutButton = () => {
    const { logout } = useAuth0()

    return (
        <Button
            className="bg-green-600 font-bold text-lg px-5"
            onClick={() => logout({ logoutParams: { returnTo: AUTH0_CALLBACK_URL } })}
        >
            <span className="mr-2 items-center flex">Log Out</span>
            <IoIosLogOut size={20} />
        </Button>
    )
}

interface NavItemProps {
    label: string
    to: string
    itemClassName?: string
    linkClassName?: string
    activeClassName?: string
}

const NavItem: React.FC<NavItemProps> = ({
    label,
    to,
    itemClassName,
    linkClassName,
    activeClassName,
}) => {
    const { pathname } = useLocation()
    return (
        <NavigationMenuItem className={itemClassName}>
            <Link className={`${linkClassName} ${to === pathname ? activeClassName : ""}`} to={to}>
                {label}
            </Link>
        </NavigationMenuItem>
    )
}

const NavButtons = () => (
    <>
        {buttons?.map(({ label, to }) => (
            <NavItem
                key={label + ":" + to}
                label={label}
                to={to}
                itemClassName="h-full pt-4 flex min-w-max"
                linkClassName="px-6 hover:border-b-2 border-green-600 hover:text-green-600 transition duration-200"
                activeClassName="text-green-600 border-b-2"
            />
        ))}
    </>
)

const MobileNavButtons = () => (
    <>
        {buttons?.map(({ label, to }) => (
            <NavItem
                key={label + ":" + to}
                label={label}
                to={to}
                itemClassName="font-bold pt-3 flex min-w-max"
                linkClassName="px-10 py-3 w-full rounded-lg text-xl hover:bg-prime hover:text-green-600 transition duration-200"
                activeClassName="text-green-600 bg-prime"
            />
        ))}
    </>
)

const LogoComp = () => (
    <div className="h-full items-center flex transition text-white hover:text-green-600">
        <span className="uppercase text-green-600">S</span>
        <span className="uppercase text-green-600">k</span>
        <span className="uppercase text-green-600">i</span>
        <span className="uppercase text-green-600">l</span>
        <span className="uppercase text-green-600">l</span>
        <span className="uppercase">T</span>
        <span className="uppercase">r</span>
        <span className="uppercase">a</span>
        <span className="uppercase">c</span>
        <span className="uppercase">k</span>
        <span className="uppercase">e</span>
        <span className="uppercase">r</span>
    </div>
)

interface NavigationProps {
    children?: ReactNode
    direction?: "bottom" | "top" | "left" | "right"
}

const Navigation: React.FC<NavigationProps> = () => {
    const { user, isAuthenticated, isLoading: isLoadingAuth } = useAuth0()
    const { refetch } = useRegisterPerson(user?.sub, user?.name)
    const { addPageError } = useContext(PageMessageContext)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const isDesktop = useMediaQuery("(min-width: 992px)")
    const isSmallMobile = useMediaQuery("(max-width: 640px)")

    useEffect(() => {
        if (isAuthenticated)
            if (user?.sub && user?.name) {
                refetch()
            } else {
                addPageError({ message: "User authentication encountered an error" })
            }
    }, [isAuthenticated, user, refetch, addPageError])

    if (!isDesktop) {
        return (
            <NavigationMenu className="bg-prime w-screen sticky top-0 border-b border-black font-bold text-gray-300">
                <NavigationMenuList className="w-screen h-14 flex justify-between">
                    <NavigationMenuItem className="h-full py-2 px-10 items-center flex">
                        <Link to="/" className="h-full flex text-xl">
                            <LogoComp />
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem className="px-10">
                        <Drawer
                            direction="left"
                            open={isDrawerOpen}
                            onOpenChange={(e) => setIsDrawerOpen(e)}
                        >
                            <DrawerTrigger
                                className="bg-gray-900 hover:bg-gray-700 p-3 rounded-lg"
                                onClick={() => setIsDrawerOpen(true)}
                            >
                                <CgMenu size="21px" />
                            </DrawerTrigger>
                            <DrawerContent className="bg-prime-light border-0 min-w-min">
                                <DrawerHeader>
                                    <DrawerTitle className="font-bold text-xl">
                                        <div
                                            className={`grid grid-cols-${
                                                isSmallMobile ? "1" : "2"
                                            } items-center justify-between`}
                                        >
                                            <div className="flex items-center">
                                                <img
                                                    className="mx-4 border-black border-1"
                                                    alt="logo"
                                                    src={logo}
                                                    height="30px"
                                                    width="30px"
                                                />
                                                <LogoComp />
                                            </div>
                                            {!isLoadingAuth && (
                                                <div
                                                    className={`flex justify-${
                                                        isSmallMobile ? "center mt-8" : "end mt-0"
                                                    }`}
                                                >
                                                    {!isAuthenticated ? (
                                                        <LoginButton />
                                                    ) : (
                                                        <LogoutButton />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </DrawerTitle>
                                    <div className="text-gray-400">
                                        {isAuthenticated && (
                                            <NavigationMenuItem className="font-bold pt-3 flex min-w-max border-b-2 border-gray-600">
                                                <div className="px-10 py-3 w-full text-2xl text-green-600 transition duration-200">
                                                    {user?.given_name
                                                        ? `Hello, ${user.given_name}`
                                                        : ""}
                                                </div>
                                            </NavigationMenuItem>
                                        )}
                                        <MobileNavButtons />
                                    </div>
                                </DrawerHeader>
                                <DrawerFooter>
                                    <Button
                                        className="font-bold text-2xl py-7"
                                        onClick={() => setIsDrawerOpen(false)}
                                    >
                                        Close
                                    </Button>
                                </DrawerFooter>
                            </DrawerContent>
                        </Drawer>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        )
    }

    // if (direction == "left") {
    //     const linkClassName = `
    //     w-full block px-10 py-4 my-1
    //     font-bold text-gray-300 rounded-lg text-2xl
    //     hover:bg-prime-light hover:text-green-600
    //     transition duration-200`
    //     const activeClassName = 'text-green-600 bg-prime'
    //     return (
    //         <div className='flex items-center justify-between'>
    //             <div className='min-h-screen max-w-none w-[300px] border-r p-4'>
    //                 <div className='flex text-xl font-bold mb-5 justify-center'>
    //                     <img className='mx-4 border-black border-1' alt='logo' src={logo} height='30px' width='30px' />
    //                     <LogoComp />
    //                 </div>
    //                 {buttons?.map(({ label, to }) => (
    //                     <div key={label + ':' + to}>
    //                         <Link className={linkClassName} to={to}>
    //                             {label}
    //                         </Link>
    //                     </div>
    //                 ))}
    //             </div>
    //             <div className='w-full h-full min-h-screen flex justify-center items-top'>
    //                 {children}
    //             </div>
    //         </div >
    //     )
    // }

    return (
        <NavigationMenu className="bg-prime w-screen sticky top-0 border-b border-black font-bold text-gray-300">
            <NavigationMenuList className="w-screen justify-start h-14">
                <NavigationMenuItem className="h-full py-2 pl-10 pr-6 items-center flex">
                    <Link to="/" className="h-full flex text-xl">
                        <LogoComp />
                    </Link>
                </NavigationMenuItem>
                <NavButtons />
                <NavigationMenuItem className="w-full" />
                <NavigationMenuItem className="text-white font-bold">
                    <div className="min-w-max mx-5">
                        {isAuthenticated && user?.given_name && `Hello, ${user.given_name}`}
                    </div>
                </NavigationMenuItem>
                <NavigationMenuItem className="flex py-1 pr-10">
                    {!isLoadingAuth && <>{!isAuthenticated ? <LoginButton /> : <LogoutButton />}</>}
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}

export default Navigation
