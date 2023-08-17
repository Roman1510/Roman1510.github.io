

const getExperiences = (): Experience[] => {

  return projects

}

const projects: Experience[] = [
  {
    name: '3D',
    description: 'Interactive 3d features',
  },
  {
    name: 'Custom cursors',
    description: 'A good addition for a custom web app',
  },
  {
    name: 'Auth',
    description: 'Mobile apps',
  },
  {
    name: 'Add-ons',
    description: 'Chrome and VSCode extensions',
  },
  {
    name: 'Mini games',
    description: 'Mini games created with Javascript',
  },
]

type Experience = {
  name: string,
  description: string,
}

export default getExperiences