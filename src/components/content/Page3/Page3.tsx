import { PixiGrid } from './Experience/PixiGrid'

export const Page3 = () => {
  return (
    <div className="section" style={{ backgroundColor: '#9fffcb' }}>
      <div>
        <PixiGrid />
      </div>
      <p className="title" style={{ padding: '50px', width: '25%' }}>
        [WASD] to control
      </p>
    </div>
  )
}
