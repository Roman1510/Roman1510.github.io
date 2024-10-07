import './index.css';
import { useDeviceType } from './hooks/useDeviceType';
import { DesktopWrapper } from './components/content/DesktopWrapper';
import { MobileWrapper } from './components/content/MobileWrapper';
import { useAnimatedFavicon } from './hooks/useAnimatedFavicon';
import { Page1 } from './components/content/Page1/Page1';
import { Page2 } from './components/content/Page2/Page2';
import { Page3 } from './components/content/Page3/Page3';
import { Page4 } from './components/content/Page4/Page4';
import { Page5 } from './components/content/Page5/Page5';
import { ResizePlaceholder } from './components/ResizePlaceholder';

const App = () => {
  useAnimatedFavicon();
  const deviceType = useDeviceType();

  const content = (
    <>
      <Page3 />
      <Page1 />
      <Page2 />
      <Page4 />
      <Page5 />
    </>
  );

  return deviceType === 'desktop' ? (
    <DesktopWrapper>
      {content}
      <ResizePlaceholder />
    </DesktopWrapper>
  ) : (
    <MobileWrapper>{content}</MobileWrapper>
  );
};

export default App;
