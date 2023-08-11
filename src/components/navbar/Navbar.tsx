import { Fragment, useState } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { Link } from "react-router-dom";
import {
  Bars3Icon
} from '@heroicons/react/24/outline'
import {
  ChevronDownIcon
} from '@heroicons/react/20/solid'

import rocket from '@/assets/rocket.svg'
import DialogBox from '@/components/dialog/DialogBox'
import projects from '@/constants/projects'

const Navbar: React.FC = () => {

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white dark:bg-slate-900">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">

          <Link to='/' className='flex -m-1.5 p-1.5'>
            <span className="sr-only">Roman Vinnick</span>
            <img
              className="h-9 w-auto"
              src={rocket}
              alt="icon"
            />
            <div className="text-lg ml-2 mt-1  text-white">Howdie!</div>
          </Link>

        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-slate-400"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <Popover.Group className="hidden lg:flex lg:gap-x-12">
          <Popover className="relative">
            <Popover.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900 dark:text-slate-400">
              Github
              <ChevronDownIcon
                className="h-5 w-5 flex-none text-gray-400"
                aria-hidden="true"
              />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-indigo-500 shadow-lg ring-1 ring-gray-900/5">
                <div className="p-4">
                  {projects.map((item) => (
                    <div
                      key={item.name}
                      className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-indigo-700"
                    >
                      <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-yellow-300 group-hover:bg-yellow-200">
                        <div className="h-6 w-6 text-gray-600 group-hover:text-indigo-600">
                          <item.icon
                            className="text-black"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                      <div className="flex-auto">
                        <a
                          href={item.href}
                          className="block font-semibold text-white "
                        >
                          {item.name}
                          <span className="absolute inset-0" />
                        </a>
                        <p className="mt-1 text-purple-200">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

              </Popover.Panel>
            </Transition>
          </Popover>

          <Link to="/about" className="text-sm font-semibold leading-6 text-gray-900 dark:text-slate-400">About me</Link>

          <Link to="/experience" className="text-sm font-semibold leading-6 text-gray-900 dark:text-slate-400">Experience</Link>


          <Link to="/coming-up" className="text-sm font-semibold leading-6 text-gray-900 dark:text-slate-400">Coming up...</Link>

        </Popover.Group>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">

          <Link to="/contact" className="text-sm font-semibold leading-6 text-gray-900 dark:text-slate-400">Contact me <span aria-hidden="true">&rarr;</span></Link>

        </div>
      </nav>
      <DialogBox
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={(e: boolean) => {
          setMobileMenuOpen(e);
        }}
      />
    </header>
  )
}

export default Navbar