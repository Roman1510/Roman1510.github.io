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
    marginBottom: '20px',
    color: '#fff',
    fontSize: '2rem',
  } as React.CSSProperties,

  wrapper: {
    width: '40rem',
    height: '40rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as React.CSSProperties,
}
