import useDeviceType from './hooks/useDeviceType'
import DesktopWrapper from './components/DesktopWrapper'
import MobileWrapper from './components/MobileWrapper'
import './index.css'
import useAnimatedFavicon from './hooks/useAnimatedFavicon'
import useScrollingBehavior from './hooks/useScrollingBehavior'

const App = () => {
  const deviceType = useDeviceType()
  useAnimatedFavicon()

  useScrollingBehavior()

  const content = (
    <>
      <div className="section" style={{ backgroundColor: 'purple' }}>
        Yo, the page is under construction!
        <p style={{ padding: '50px' }}></p>
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
