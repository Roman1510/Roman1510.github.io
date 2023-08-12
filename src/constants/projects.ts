import {
  DevicePhoneMobileIcon,
  PuzzlePieceIcon,
  CursorArrowRaysIcon,
  SquaresPlusIcon,
  CubeIcon
} from '@heroicons/react/24/outline'

const getProjects = (isMobile:boolean):Project[]=>{
  if(!isMobile){
    return projects 
  } else {
    return projects.filter((item)=>!item.desktopOnly)
  }
}

const projects:Project[] = [
  {
    name: '3D',
    description: 'Interactive 3d features',
    href: '#',
    icon: CubeIcon,
    desktopOnly: false
  },
  {
    name: 'Custom cursors',
    description: 'A good addition for a custom web app',
    href: '#',
    icon: CursorArrowRaysIcon,
    desktopOnly: true
  },
  {
    name: 'Auth',
    description: 'Mobile apps',
    href: '#',
    icon: DevicePhoneMobileIcon,
    desktopOnly: false
  },
  {
    name: 'Add-ons',
    description: 'Chrome and VSCode extensions',
    href: '#',
    icon: SquaresPlusIcon,
    desktopOnly: false
  },
  {
    name: 'Mini games',
    description: 'Mini games created with Javascript',
    href: '#',
    icon: PuzzlePieceIcon,
    desktopOnly: false
  },
]

type Project = {
  name: string,
  description: string,
  href: string,
  icon: React.ElementType
  desktopOnly: boolean
}

export default getProjects