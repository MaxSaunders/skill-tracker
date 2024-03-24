import { Link, useLocation } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { CgMenu } from "react-icons/cg";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList
} from '@/components/ui/navigation-menu'

import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

import { Button } from '@/components/ui/button';
import { useRegisterPerson } from '@/Helpers';
import { PageErrorsContext } from './error';
import { useMediaQuery } from '@/Helpers/useMediaQuery';

const AUTH0_CALLBACK_URL = import.meta.env.VITE_AUTH0_CALLBACK_URL

export const LoginButton = () => {
    const { loginWithPopup } = useAuth0()

    return (
        <Button className='bg-green-600 font-bold text-lg' onClick={() => loginWithPopup()}>
            Log In
        </Button>
    )
}

export const LogoutButton = () => {
    const { logout } = useAuth0();

    return (
        <Button className='bg-green-600 font-bold text-lg' onClick={() => logout({ logoutParams: { returnTo: AUTH0_CALLBACK_URL } })}>
            Log Out
        </Button>
    )
}

interface NavItemProps {
    label: string,
    to: string,
    itemClassName?: string,
    linkClassName?: string,
    activeClassName?: string,
}

const NavItem: React.FC<NavItemProps> = ({ label, to, itemClassName, linkClassName, activeClassName }) => {
    const { pathname } = useLocation()
    return (
        <NavigationMenuItem className={itemClassName}>
            <Link className={`${linkClassName} ${to === pathname ? activeClassName : ''}`} to={to}>
                {label}
            </Link>
        </NavigationMenuItem>
    )
}

const NavButtons = () => {
    const linkClassName = 'px-10 text-xl hover:border-b border-green-600 hover:text-green-600 transition duration-200'
    const activeClassName = 'text-green-600 border-b'
    const itemClassName = 'h-full pt-3 flex min-w-max'
    return (
        <>
            <NavItem label='Home' to='/' itemClassName={itemClassName} linkClassName={linkClassName} activeClassName={activeClassName} />
            <NavItem label='People' to='/people' itemClassName={itemClassName} linkClassName={linkClassName} activeClassName={activeClassName} />
            <NavItem label='Skills' to='/skills' itemClassName={itemClassName} linkClassName={linkClassName} activeClassName={activeClassName} />
            <NavItem label='My Skills' to='/my-skills' itemClassName={itemClassName} linkClassName={linkClassName} activeClassName={activeClassName} />
        </>
    )
}

const MobileNavButtons = () => {
    const linkClassName = 'px-10 py-3 w-full rounded-lg text-2xl hover:bg-prime hover:text-green-600 transition duration-200'
    const activeClassName = 'text-green-600 bg-prime'
    const itemClassName = 'font-bold pt-3 flex min-w-max'
    return (
        <>
            <NavItem label='Home' to='/' itemClassName={itemClassName} linkClassName={linkClassName} activeClassName={activeClassName} />
            <NavItem label='People' to='/people' itemClassName={itemClassName} linkClassName={linkClassName} activeClassName={activeClassName} />
            <NavItem label='Skills' to='/skills' itemClassName={itemClassName} linkClassName={linkClassName} activeClassName={activeClassName} />
            <NavItem label='My Skills' to='/my-skills' itemClassName={itemClassName} linkClassName={linkClassName} activeClassName={activeClassName} />
        </>
    )
}

const Navigation = () => {
    const { user, isAuthenticated, isLoading: isLoadingAuth } = useAuth0();
    const { refetch } = useRegisterPerson(user?.sub, user?.name)
    const { addPageError } = useContext(PageErrorsContext)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const isDesktop = useMediaQuery("(min-width: 992px)")
    const isSmallMobile = useMediaQuery("(max-width: 640px)")

    useEffect(() => {
        if (isAuthenticated)
            if (user?.sub && user?.name) {
                refetch()
            } else {
                addPageError({ message: 'User authentication encountered an error' })
            }
    }, [isAuthenticated, user, refetch, addPageError])

    if (!isDesktop) {
        return (
            <NavigationMenu className='bg-prime w-screen sticky top-0 border-b border-black font-bold text-base text-gray-300'>
                <NavigationMenuList className='w-screen justify-start h-14 flex justify-between'>
                    <NavigationMenuItem className='h-full py-2 px-10 items-center flex'>
                        <Link to='/' className='h-full flex text-xl'>
                            <div className='h-full items-center flex transition hover:text-green-600'>
                                <span className='uppercase text-green-600'>S</span>
                                <span className='uppercase text-green-600'>k</span>
                                <span className='uppercase text-green-600'>i</span>
                                <span className='uppercase text-green-600'>l</span>
                                <span className='uppercase text-green-600'>l</span>
                                <span className='uppercase'>T</span>
                                <span className='uppercase'>r</span>
                                <span className='uppercase'>a</span>
                                <span className='uppercase'>c</span>
                                <span className='uppercase'>k</span>
                                <span className='uppercase'>e</span>
                                <span className='uppercase'>r</span>
                            </div>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem className='px-10'>
                        <Drawer direction='left' open={isDrawerOpen} onOpenChange={e => setIsDrawerOpen(e)}>
                            <DrawerTrigger>
                                <Button onClick={() => setIsDrawerOpen(true)}><CgMenu /></Button>
                            </DrawerTrigger>
                            <DrawerContent className='bg-prime-light border-green-600 border-2 min-w-min'>
                                <DrawerHeader>
                                    <DrawerTitle className='font-bold text-green-500 text-2xl'>
                                        <div className={`grid grid-cols-${isSmallMobile ? '1' : '2'} items-center justify-between`}>
                                            <div>
                                                Skill Tracker Menu
                                            </div>
                                            {!isLoadingAuth && (
                                                <div className={`flex justify-${isSmallMobile ? 'center mt-8' : 'end mt-0'}`}>
                                                    {!isAuthenticated ? <LoginButton /> : <LogoutButton />}
                                                </div>
                                            )}
                                        </div>
                                    </DrawerTitle>
                                    <DrawerDescription>
                                        <MobileNavButtons />
                                        {isAuthenticated && (
                                            <NavigationMenuItem className='text-white font-bold'>
                                                <div className='min-w-max mx-5'>
                                                    {user?.given_name ? `Hello, ${user.given_name}` : ''}
                                                </div>
                                            </NavigationMenuItem>
                                        )}
                                    </DrawerDescription>
                                </DrawerHeader>
                                <DrawerFooter>
                                    <Button className='font-bold text-2xl py-7' onClick={() => setIsDrawerOpen(false)}>Close</Button>
                                </DrawerFooter>
                            </DrawerContent>
                        </Drawer>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        )
    }

    return (
        <NavigationMenu className='bg-prime w-screen sticky top-0 border-b border-black font-bold text-base text-gray-300'>
            <NavigationMenuList className='w-screen justify-start h-14'>
                <NavigationMenuItem className='h-full py-2 px-10 items-center flex'>
                    <Link to='/' className='h-full flex text-xl'>
                        <div className='h-full items-center flex transition hover:text-green-600'>
                            <span className='uppercase text-green-600'>S</span>
                            <span className='uppercase text-green-600'>k</span>
                            <span className='uppercase text-green-600'>i</span>
                            <span className='uppercase text-green-600'>l</span>
                            <span className='uppercase text-green-600'>l</span>
                            <span className='uppercase'>T</span>
                            <span className='uppercase'>r</span>
                            <span className='uppercase'>a</span>
                            <span className='uppercase'>c</span>
                            <span className='uppercase'>k</span>
                            <span className='uppercase'>e</span>
                            <span className='uppercase'>r</span>
                        </div>
                    </Link>
                </NavigationMenuItem>
                <NavButtons />
                <NavigationMenuItem className='w-full' />
                <NavigationMenuItem className='text-white font-bold'>
                    <div className='min-w-max mx-5'>
                        {isAuthenticated && (
                            <>
                                {user?.given_name ? `Hello, ${user.given_name}` : ''}
                            </>
                        )}
                    </div>
                </NavigationMenuItem>
                <NavigationMenuItem className='flex py-1 pr-10'>
                    {!isLoadingAuth && (
                        <>
                            {!isAuthenticated ? <LoginButton /> : <LogoutButton />}
                        </>
                    )}
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}

export default Navigation
