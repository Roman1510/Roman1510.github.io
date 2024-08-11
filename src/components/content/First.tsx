import React from 'react'
import { MatrixRain } from './First/MatrixRain'

export const First = () => {
  return (
    <div className="section" style={styles.container}>
      <div className="title" style={styles.title}>
        <p>Roman Vinnick</p>
      </div>
      <div style={styles.wrapper}>
        <MatrixRain />
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#532b88',
    margin: 0,
    padding: 0,
  } as React.CSSProperties,

  title: {
    padding: '1rem',
    position: 'absolute',
    color: '#fff',
    fontSize: '5rem',
    zIndex: '11',
  } as React.CSSProperties,

  wrapper: {
    width: '50rem',
    height: '50rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '12',
  } as React.CSSProperties,
}
