import { PropsWithChildren } from 'react'

const MobileWrapper = ({ children }: PropsWithChildren) => {
  return <div className="mobile-container">{children}</div>
}

export default MobileWrapper
