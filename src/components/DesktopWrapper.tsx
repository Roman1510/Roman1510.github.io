import { useDesktopScrolling } from '@/hooks/useDesktopScrolling'
import { PropsWithChildren } from 'react'

const DesktopWrapper = ({ children }: PropsWithChildren) => {
  useDesktopScrolling()
  return <div className="desktop-container">{children}</div>
}

export default DesktopWrapper
