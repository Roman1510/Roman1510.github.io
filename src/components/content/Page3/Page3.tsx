import { PixiGrid } from './Experience/PixiGrid'

export const Page3 = () => {
  return (
    <div
      className="section"
      style={{
        paddingTop: '2rem',
        backgroundColor: '#9fffcb',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <PixiGrid />
      <p
        className="title"
        style={{
          width: '70%',
          fontSize: '3rem',
          textAlign: 'center',
        }}
      >
        [WASD] to control
      </p>
    </div>
  )
}
