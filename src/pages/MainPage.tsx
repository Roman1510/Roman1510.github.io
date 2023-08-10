import '@/pages/styles/MainPage.css'
import Content from '@/components/content/Content'
import ParticleBackground from '@/components/background/ParticleBackground';

const MainPage: React.FC = () => {
  return <div className="main-page"><Content />
    <div style={{ position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', zIndex: -1 }}>
      <ParticleBackground />
    </div></div>
}

export default MainPage