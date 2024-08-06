import useDeviceType from './hooks/useDeviceType'
import DesktopWrapper from './components/DesktopWrapper'
import MobileWrapper from './components/MobileWrapper'
import useAnimatedFavicon from './hooks/useAnimatedFavicon'
import useGsapScrollingBehavior from './hooks/useScrollingBehavior'
import './index.css'

const App = () => {
  useAnimatedFavicon()
  useGsapScrollingBehavior()
  const deviceType = useDeviceType()

  const content = (
    <>
      <div className="section" style={{ backgroundColor: 'purple' }}>
        <div className="text-parallax" style={{ padding: '50px' }}>
          <p> Roman Vinnick</p>
        </div>
      </div>
      <div className="section" style={{ backgroundColor: 'gray' }}>
        <p style={{ padding: '50px' }}></p>
      </div>
      <div className="section" style={{ backgroundColor: 'lightblue' }}>
        <p style={{ padding: '50px' }}></p>
      </div>
      <div className="section" style={{ backgroundColor: 'lightgreen' }}>
        <p style={{ padding: '50px' }}></p>
      </div>
      <div className="section" style={{ backgroundColor: 'orange' }}>
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
