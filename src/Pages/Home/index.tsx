import { useState } from 'react'
import logo from '../../img/logo-inverse.svg'
import logo2 from '../../img/logo.svg'

const LogoIcon = () => {
    const [hovered, setHovered] = useState(false)
    return (
        <div className='flex mb-10 mx-8 col-span-1 md:col-span-2 justify-center'>
            <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} >
                {hovered ? (
                    <img className='border-black border-1' alt='logo' src={logo2} height='100px' width='100px' />
                ) : (
                    <img className='border-black border-1' alt='logo' src={logo} height='100px' width='100px' />
                )}
            </div>
        </div>
    )
}

const HomePage = () =>
    <div className='text-white mt-40'>
        <div className={`
            grid grid-cols-1 md:grid-cols-2 gap-4
            justify-center items-center font-bold
            text-2xl sm:text-4xl md:text-5xl lg:text-6xl cursor-default
            `}>
            <LogoIcon />
            <div className='text-center md:text-right'>
                Welcome to
            </div>
            <div className='flex justify-center md:justify-start transition hover:text-green-600'>
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
        </div>
        <div className='mt-12 flex text-center justify-center text-xl lg:text-xl font-bold overflow-auto'>
            A website to track your team's core competencies
        </div>
    </div >

// {/* <div className='text-white min-w-max h-full flex bg-red-500' style={{ flexFlow: 'column' }}>
// {/* < div className='text-white min-w-max absolute h-max inset-1/2 -translate-x-1/2 -translate-y-1/2' > */}
// <div className='fixed font-bold text-6xl '>
//     <div className='flex justify-center items-center font-bold text-6xl '> */}

export default HomePage
