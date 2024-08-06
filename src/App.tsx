import useAnimatedFavicon from './hooks/useAnimatedFavicon';

const App = () => {
  useAnimatedFavicon();
  return (
    <div>
      <div
        style={{
          height: '100vh',
          backgroundColor: 'black',
          color: 'white',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        Yo, the page is under construction!
        <p style={{ padding: '50px' }}></p>
      </div>
      <div style={{ height: '100vh', backgroundColor: 'gray' }}>
        <p style={{ padding: '50px' }}></p>
      </div>
      <div style={{ height: '100vh', backgroundColor: 'lightblue' }}>
        <p style={{ padding: '50px' }}></p>
      </div>
      <div style={{ height: '100vh', backgroundColor: 'lightgreen' }}>
        <p style={{ padding: '50px' }}></p>
      </div>
      <div style={{ height: '100vh', backgroundColor: 'orange' }}>
        <p style={{ padding: '50px' }}></p>
      </div>
    </div>
  );
};

export default App;
