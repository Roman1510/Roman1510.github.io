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
      <div className="section" style={{ backgroundColor: '#331e36ff' }}>
        <div className="title" style={{ padding: '50px' }}>
          <p> Roman Vinnick</p>
        </div>
      </div>
      <div className="section" style={{ backgroundColor: '#41337aff' }}>
        <p style={{ padding: '50px' }}></p>
      </div>
      <div className="section" style={{ backgroundColor: '#6ea4bfff' }}>
        <p style={{ padding: '50px' }}></p>
      </div>
      <div className="section" style={{ backgroundColor: '#c2efebff' }}>
        <p style={{ padding: '50px' }}></p>
      </div>
      <div className="section" style={{ backgroundColor: '#ecfee8ff' }}>
        <p style={{ padding: '50px' }}></p>
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
