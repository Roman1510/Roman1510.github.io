import { Dialog, Disclosure } from '@headlessui/react'
import rocket from '@/assets/rocket.svg'
import {
  ArrowPathIcon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import {
  ChevronDownIcon,
  PhoneIcon,
  PlayCircleIcon,
} from '@heroicons/react/20/solid'
function DialogBox({ mobileMenuOpen, setMobileMenuOpen }) {


  const products = [
    {
      name: 'Analytics',
      description: 'Get a better understanding of your traffic',
      href: '#',
      icon: ChartPieIcon,
    },
    {
      name: 'Engagement',
      description: 'Speak directly to your customers',
      href: '#',
      icon: CursorArrowRaysIcon,
    },
    {
      name: 'Security',
      description: 'Your customers’ data will be safe and secure',
      href: '#',
      icon: FingerPrintIcon,
    },
    {
      name: 'Integrations',
      description: 'Connect with third-party tools',
      href: '#',
      icon: SquaresPlusIcon,
    },
    {
      name: 'Automations',
      description: 'Build strategic funnels that will convert',
      href: '#',
      icon: ArrowPathIcon,
    },
  ]
  const callsToAction = [
    { name: 'Watch demo', href: '#', icon: PlayCircleIcon },
    { name: 'Contact sales', href: '#', icon: PhoneIcon },
  ]
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
    <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white dark:bg-slate-800 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
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
          className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-slate-400"
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
                  <Disclosure.Button className="text-gray-900 dark:text-slate-400 flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7  hover:bg-gray-50">
                    Product
                    <ChevronDownIcon
                      className={classNames(
                        open ? 'rotate-180' : '',
                        'h-5 w-5 flex-none'
                      )}
                      aria-hidden="true"
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="mt-2 space-y-2">
                    {[...products, ...callsToAction].map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 dark:text-slate-400 hover:bg-gray-50"
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
            <a
              href="#"
              className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 dark:text-slate-400 hover:bg-gray-50"
            >
              Features
            </a>
            <a
              href="#"
              className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 dark:text-slate-400 hover:bg-gray-50"
            >
              Marketplace
            </a>
            <a
              href="#"
              className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 dark:text-slate-400 hover:bg-gray-50"
            >
              Company
            </a>
          </div>
          <div className="py-6">
            <a
              href="#"
              className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 dark:text-slate-400 hover:bg-gray-50"
            >
              Log in
            </a>
          </div>
        </div>
      </div>
    </Dialog.Panel>
  </Dialog>
}

export default DialogBox