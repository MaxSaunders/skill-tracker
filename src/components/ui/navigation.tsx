import { Link, useLocation } from 'react-router-dom'
import { useContext, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList
} from '@/components/ui/navigation-menu'

import { Button } from '@/components/ui/button';
import { useRegisterPerson } from '@/Helpers';
import { PageErrorsContext } from './error';

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
    pathName: string,
    className: string,
    activeClassName: string,
}

const NavItem: React.FC<NavItemProps> = ({ label, to, pathName, className, activeClassName }) =>
    <NavigationMenuItem className='h-full pt-3 flex min-w-max'>
        <Link className={`${className} ${to === pathName ? activeClassName : ''}`} to={to}>
            {label}
        </Link>
    </NavigationMenuItem>

const NavButtons = () => {
    const { pathname } = useLocation()
    const itemClassName = 'px-10 text-xl hover:border-b border-green-600 hover:text-green-600 transition duration-200'
    const activeClassName = 'text-green-600 border-b'
    return (
        <>
            <NavItem label='Home' to='/' pathName={pathname} className={itemClassName} activeClassName={activeClassName} />
            <NavItem label='People' to='/people' pathName={pathname} className={itemClassName} activeClassName={activeClassName} />
            <NavItem label='Skills' to='/skills' pathName={pathname} className={itemClassName} activeClassName={activeClassName} />
            <NavItem label='My Skills' to='/my-skills' pathName={pathname} className={itemClassName} activeClassName={activeClassName} />
        </>
    )
}

const Navigation = () => {
    const { user, isAuthenticated, isLoading: isLoadingAuth } = useAuth0();
    const { refetch } = useRegisterPerson(user?.sub, user?.name)
    const { addPageError } = useContext(PageErrorsContext)

    useEffect(() => {
        if (isAuthenticated)
            if (user?.sub && user?.name) {
                refetch()
            } else {
                addPageError({ message: 'User authentication encountered an error' })
            }
    }, [isAuthenticated, user, refetch, addPageError])

    return (
        <NavigationMenu className='w-screen sticky -top-0 border-b border-black font-bold text-base text-gray-300'>
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
                <NavigationMenuItem className='flex py-1 pr-5'>
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
