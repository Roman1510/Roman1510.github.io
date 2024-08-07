import useDeviceType from './hooks/useDeviceType'
import DesktopWrapper from './components/DesktopWrapper'
import MobileWrapper from './components/MobileWrapper'
import useAnimatedFavicon from './hooks/useAnimatedFavicon'

import './index.css'

const App = () => {
  useAnimatedFavicon()

  const deviceType = useDeviceType()

  const content = (
    <>
      <div className="section" style={{ backgroundColor: '#532b88' }}>
        <div className="title" style={{ padding: '50px' }}>
          <p> Roman Vinnick</p>
        </div>
      </div>
      <div className="section" style={{ backgroundColor: '#9b72cf' }}>
        <div className="title" style={{ padding: '50px' }}>
          <p style={{ padding: '50px' }}>Tha</p>
        </div>
      </div>
      <div className="section" style={{ backgroundColor: '#9fffcb' }}>
        <div className="title" style={{ padding: '50px' }}>
          <p style={{ padding: '50px' }}>Best</p>
        </div>
      </div>
      <div className="section" style={{ backgroundColor: '#c8b1e4' }}>
        <div className="title" style={{ padding: '50px' }}>
          <p style={{ padding: '50px' }}>Developer</p>
        </div>
      </div>
      <div className="section" style={{ backgroundColor: '#c7f9cc' }}>
        <div className="title" style={{ padding: '50px' }}>
          <p style={{ padding: '50px' }}>Out there</p>
        </div>
      </div>
    </>
  )

  return deviceType === 'desktop' ? (
    <DesktopWrapper>{content}</DesktopWrapper>
  ) : (
    <MobileWrapper>{content}</MobileWrapper>
  )
}

export default App
