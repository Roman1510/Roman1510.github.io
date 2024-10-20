import Experience from "./Experience"

export const Page4 = () => {
  return (
    <div className="section" style={{ backgroundColor: '#c8b1e4', height: '100vh' }}>
      <div className="title" >
        <p style={{ padding: '50px' }}>This page is...</p>
      </div>
      <div style={styles.wrapper}>
        <div style={{ height: '50%' }}>
          <Experience />
        </div>
      </div>
    </div>
  )
}


const styles = {
  wrapper: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    bottom: 0,
  } as React.CSSProperties,

  headerText: {
    position: 'absolute',
    top: '10%',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '64px',
    fontFamily: "'YourFontName', sans-serif",
    color: 'white',
    textAlign: 'center',
    userSelect: 'none',
    zIndex: 11,
  } as React.CSSProperties,
};
