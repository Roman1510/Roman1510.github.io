import { Dialog, Disclosure } from '@headlessui/react'
import rocket from '@/assets/rocket.svg'
import {
  XMarkIcon,
} from '@heroicons/react/24/outline'
import {
  ChevronDownIcon,
} from '@heroicons/react/20/solid'
import getProjects from '@/constants/projects'
import { Link } from "react-router-dom";

const projects = getProjects(true)

type Props = {
  mobileMenuOpen: boolean,
  setMobileMenuOpen: (input: boolean) => void
}

const DialogBox: React.FC<Props> = ({ mobileMenuOpen, setMobileMenuOpen }) => {

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
  }
  return <Dialog
    as="div"
    className="lg:hidden"
    open={mobileMenuOpen}
    onClose={setMobileMenuOpen}
  >
    <div className="fixed inset-0 z-10" />
    <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-slate-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
      <div className="flex items-center justify-between">
        <a href="#" className="-m-1.5 p-1.5">
          <span className="sr-only">Roman Vinnick</span>
          <img
            className="h-8 w-auto"
            src={rocket}
            alt="icon"
          />
        </a>
        <button
          type="button"
          className="-m-2.5 rounded-md p-2.5 text-slate-400"
          onClick={() => setMobileMenuOpen(false)}
        >
          <span className="sr-only">Close menu</span>
          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-6 flow-root">
        <div className="-my-6 divide-y divide-gray-500/10">
          <div className="space-y-2 py-6">
            <Disclosure as="div" className="-mx-3">
              {({ open }) => (
                <>
                  <Disclosure.Button className="text-slate-400 flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7  hover:bg-gray-50">
                    Projects
                    <ChevronDownIcon
                      className={classNames(
                        open ? 'rotate-180' : '',
                        'h-5 w-5 flex-none'
                      )}
                      aria-hidden="true"
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="mt-2 space-y-2">
                    {[...projects].map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-slate-400 hover:bg-gray-50"
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)}
              className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-slate-400 hover:bg-gray-50"
            >
              About me
            </Link>
            <Link to="/experience" onClick={() => setMobileMenuOpen(false)}
              className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-slate-400 hover:bg-gray-50"
            >
              Experience
            </Link>
            <Link to="/coming-up" onClick={() => setMobileMenuOpen(false)}
              className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-slate-400 hover:bg-gray-50"
            >
              Coming up...
            </Link>
          </div>
          <div className="py-6">
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)}
              className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-slate-400 hover:bg-gray-50"
            >
              Contact me <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </Dialog.Panel>
  </Dialog>
}



export default DialogBox