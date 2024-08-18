import { PropsWithChildren } from 'react'

export const MobileWrapper = ({ children }: PropsWithChildren) => {
  return <div className="mobile-container">{children}</div>
}
