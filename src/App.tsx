import React from 'react'
import useAnimatedFavicon from './hooks/useAnimatedFavicon'

const App: React.FC = () => {
  useAnimatedFavicon()

  return (
    <div>
      <div
        style={{ height: '100vh', backgroundColor: 'black', color: 'white' }}
      >
        <p style={{ padding: '50px' }}>Black section for scroll testing</p>
      </div>
      <div style={{ height: '100vh', backgroundColor: 'gray' }}>
        <p style={{ padding: '50px' }}>Gray section for scroll testing</p>
      </div>
      <div style={{ height: '100vh', backgroundColor: 'lightblue' }}>
        <p style={{ padding: '50px' }}>Lightblue section for scroll testing</p>
      </div>
      <div style={{ height: '100vh', backgroundColor: 'lightgreen' }}>
        <p style={{ padding: '50px' }}>Lightgreen section for scroll testing</p>
      </div>
      <div style={{ height: '100vh', backgroundColor: 'orange' }}>
        <p style={{ padding: '50px' }}>Orange section for scroll testing</p>
      </div>
    </div>
  )
}

export default App
