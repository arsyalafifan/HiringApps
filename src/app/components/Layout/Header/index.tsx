'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import Logo from './Logo'
// import HeaderLink from './Navigation/HeaderLink'
// import MobileHeaderLink from './Navigation/MobileHeaderLink'
import { NavLinkType } from '@/app/types/navlink'
import { Icon } from '@iconify/react'
import { useTheme } from 'next-themes'
// import { getDataPath } from '@/app/utils/paths'
import { useAuth } from '../../../contexts/AuthContext'

const Header: React.FC = () => {
  const [navlink, setNavlink] = useState<NavLinkType[]>([])
  const { theme, setTheme } = useTheme()
  const [navbarOpen, setNavbarOpen] = useState(false)
  const [sticky, setSticky] = useState(false)
  const [isSignInOpen, setIsSignInOpen] = useState(false)
  const [isSignUpOpen, setIsSignUpOpen] = useState(false)
  const signInRef = useRef<HTMLDivElement>(null)
  const signUpRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const { user, photo, loading, logout } = useAuth()

  const [openDesktop, setOpenDesktop] = useState(false)
  const refDesktop = useRef<HTMLDivElement>(null)

  const [openMobile, setOpenMobile] = useState(false)
  const refMobile = useRef<HTMLDivElement>(null)

  //   fetchData
  useEffect(() => {
      setNavlink([
        { label: 'Home', href: '/' },
        { label: 'Profile', href: '/profile' },
        { label: 'Vacancy', href: '/vacancy' },
        // { label: 'Register', href: '/register' }
      ])
  }, [])

  useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    if (refDesktop.current && !refDesktop.current.contains(e.target as Node)) {
      setOpenDesktop(false)
    }
    if (refMobile.current && !refMobile.current.contains(e.target as Node)) {
      setOpenMobile(false)
    }
  }

  document.addEventListener("mousedown", handleClickOutside)
  return () => document.removeEventListener("mousedown", handleClickOutside)
}, [])

  const handleScroll = () => {
    setSticky(window.scrollY >= 80)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (
      signInRef.current &&
      !signInRef.current.contains(event.target as Node)
    ) {
      setIsSignInOpen(false)
    }
    if (
      signUpRef.current &&
      !signUpRef.current.contains(event.target as Node)
    ) {
      setIsSignUpOpen(false)
    }
    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(event.target as Node) &&
      navbarOpen
    ) {
      setNavbarOpen(false)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [navbarOpen, isSignInOpen, isSignUpOpen])

  useEffect(() => {
    if (isSignInOpen || isSignUpOpen || navbarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [isSignInOpen, isSignUpOpen, navbarOpen])

  console.log(photo)
  console.log("PHOTO:", photo)
  console.log("LOADING:", loading)

  return (
    <header
      className={`fixed top-0 py-1 z-50 w-full bg-transparent transition-all ${
        sticky ? 'shadow-lg dark:shadow-neutral-50/5 bg-white dark:bg-darklight' : 'shadow-none'
      }`}>
      <div
        className={`container flex items-center justify-between gap-10 duration-300  ${
          sticky ? 'py-3' : 'py-4'
        }`}>
        <Logo />
        <nav>
          <ul className='hidden xl:flex flex-grow items-center justify-start gap-10 '>
            {navlink.map((item, index) => (
              <Link key={index} href={item.href}>
                {item.label}
              </Link>
            ))}
          </ul>
        </nav>
        <div className='flex items-center gap-4'>
          {/* <div>
            <div className='relative hidden xl:block'>
              <input
                type='text'
                placeholder='Search'
                className='border rounded-lg pl-4 pr-8 py-2 border-primary/50 focus:border-primary outline-0 placeholder:text-primary/30'
              />
              <button>
                <Icon
                  icon={'solar:magnifer-linear'}
                  width={17}
                  height={17}
                  className='text-primary text-bold absolute top-3 right-3'
                />
              </button>
            </div>
          </div> */}
          <button
            aria-label='Toggle theme'
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className='flex items-center justify-center text-body-color duration-300 hover:cursor-pointer hover:text-primary dark:text-white bg-neutral-50 rounded-full dark:bg-darklight p-2 outline-none'>
            <Icon
              icon='solar:sun-2-bold'
              width='24'
              height='24'
              className='hidden dark:block'
            />
            <Icon
              icon='solar:moon-bold'
              width='24'
              height='24'
              className='dark:hidden block'
            />
          </button>
          {!user ? (
                <>
                  {/* LOGIN */}
                  <Link
                    href="/login"
                    className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition"
                  >
                    Login
                  </Link>

                  {/* REGISTER */}
                  <Link
                    href="/register"
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <div className="relative" ref={refDesktop}>
                  {/* AVATAR */}
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => setOpenDesktop(!openDesktop)}
                  >
                    <Image
                      src={photo || "/images/avatar.png"}
                      alt="User Avatar"
                      width={36}
                      height={36}
                      className="w-9 h-9 rounded-full"
                    />
                  </div>

                  {/* DROPDOWN */}
                  {openDesktop && (
                    <div className="absolute right-0 mt-2 w-40 bg-white shadow rounded-lg z-50">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setOpenDesktop(false)}
                      >
                        Profile
                      </Link>

                      <button
                        onClick={() => {
                          logout()
                          setOpenDesktop(false)
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
          <button
            onClick={() => setNavbarOpen(!navbarOpen)}
            className='block xl:hidden p-2 rounded-lg hover:cursor-pointer'
            aria-label='Toggle mobile menu'>
            <span className='block w-6 h-0.5 bg-darkblue dark:bg-white'></span>
            <span className='block w-6 h-0.5 bg-darkblue dark:bg-white mt-1.5'></span>
            <span className='block w-6 h-0.5 bg-darkblue dark:bg-white mt-1.5'></span>
          </button>
        </div>
      </div>
      {navbarOpen && (
        <div className='fixed top-0 left-0 w-full h-full bg-black/50 z-40' />
      )}
      <div
        ref={mobileMenuRef}
        className={`xl:hidden fixed top-0 right-0 h-full w-full bg-white dark:bg-darklight shadow-lg transform transition-transform duration-300 max-w-xs ${
          navbarOpen ? 'translate-x-0' : 'translate-x-full'
        } z-50`}>
        <div className='flex items-center justify-between p-4'>
          <Logo />
          <button
            onClick={() => setNavbarOpen(false)}
            aria-label='Close mobile menu'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              className='dark:text-white dark:hover:text-primary hover:text-primary hover:cursor-pointer'>
              <path
                fill='none'
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>
        <nav className='flex flex-col items-start p-4'>
          {navlink.map((item, index) => (
            <Link
                key={index}
                href={item.href}
                className="block w-full py-2 text-base text-gray-700 hover:text-primary"
              >
                {item.label}
              </Link>
          ))}
          <div className='mt-4 flex flex-col gap-4 w-full'>
            <div className='relative w-full'>
              <input
                type='text'
                placeholder='Search'
                className='border rounded-lg pl-4 pr-8 py-2 border-primary/50 focus:border-primary outline-0 placeholder:text-primary/20 w-full'
              />
              <Icon
                icon={'solar:magnifer-linear'}
                width={17}
                height={17}
                className='text-primary text-bold absolute top-3 right-3'
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="mt-4 w-full">
                {!user ? (
                  <>
                    {/* LOGIN */}
                    <Link
                      href="/login"
                      className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition"
                    >
                      Login
                    </Link>

                    {/* REGISTER */}
                    <Link
                      href="/register"
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90"
                    >
                      Register
                    </Link>
                  </>
                ) : (
                  <div className="relative" ref={refMobile}>
                    {/* AVATAR */}
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => setOpenMobile(!openMobile)}
                    >
                      <Image
                        src={photo || "/images/avatar.png"}
                        alt="User Avatar"
                        width={36}
                        height={36}
                        className="w-9 h-9 rounded-full"
                      />
                    </div>

                    {/* DROPDOWN */}
                    {openMobile && (
                      <div className="absolute right-0 mt-2 w-40 bg-white shadow rounded-lg z-50">
                        <Link
                          href="/profile"
                          className="block px-4 py-2 hover:bg-gray-100"
                          onClick={() => setOpenMobile(false)}
                        >
                          Profile
                        </Link>

                        <button
                          onClick={() => {
                            logout()
                            setOpenMobile(false)
                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header
