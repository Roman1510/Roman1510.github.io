import './index.css'
import useDeviceType from './hooks/useDeviceType'
import DesktopWrapper from './components/DesktopWrapper'
import MobileWrapper from './components/MobileWrapper'
import useAnimatedFavicon from './hooks/useAnimatedFavicon'
import { First } from './components/content/First'
import { Second } from './components/content/Second'
import { Third } from './components/content/Third'
import { Forth } from './components/content/Forth'
import { Fifth } from './components/content/Fifth'

const App = () => {
  useAnimatedFavicon()
  const deviceType = useDeviceType()

  const content = (
    <>
      <First />
      <Second />
      <Third />
      <Forth />
      <Fifth />
    </>
  )

  return deviceType === 'desktop' ? (
    <DesktopWrapper>{content}</DesktopWrapper>
  ) : (
    <MobileWrapper>{content}</MobileWrapper>
  )
}

export default App
