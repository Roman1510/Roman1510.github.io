import { PropsWithChildren } from 'react'

const DesktopWrapper = ({ children }: PropsWithChildren) => {
  return <div className="desktop-container">{children}</div>
}

export default DesktopWrapper
