import {
  DevicePhoneMobileIcon,
  PuzzlePieceIcon,
  CursorArrowRaysIcon,
  SquaresPlusIcon,
  CubeIcon
} from '@heroicons/react/24/outline'



const projects:Project[] = [
  {
    name: '3D',
    description: 'Interactive 3d features',
    href: '#',
    icon: CubeIcon,
  },
  {
    name: 'Custom cursors',
    description: 'A good addition for a custom web app',
    href: '#',
    icon: CursorArrowRaysIcon,
  },
  {
    name: 'Auth',
    description: 'Mobile apps',
    href: '#',
    icon: DevicePhoneMobileIcon,
  },
  {
    name: 'Add-ons',
    description: 'Chrome and VSCode extensions',
    href: '#',
    icon: SquaresPlusIcon,
  },
  {
    name: 'Mini games',
    description: 'Mini games created with Javascript',
    href: '#',
    icon: PuzzlePieceIcon,
  },
]

type Project = {
  name: string,
  description: string,
  href: string,
  icon: React.ElementType
}

export default projects