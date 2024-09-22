import { useDeviceType } from '@/hooks/useDeviceType'
import { PixiGrid } from './Experience/PixiGrid'

export const Page3 = () => {
  const device = useDeviceType()

  return (
    <div
      className="section"
      style={{
        backgroundColor: '#9fffcb',
        display: 'flex',
        flexDirection: device === 'desktop' ? 'row' : 'column',
        alignItems: 'center',
      }}
    >
      <PixiGrid />
      <p
        className="title"
        style={{
          width: '40%',
          fontSize: '3rem',
          textAlign: 'center',
          userSelect: 'none',
        }}
      >
        [WASD] to control
      </p>
    </div>
  )
}
