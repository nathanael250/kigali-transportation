import React from 'react';
import MapComponent from './Map';

function App() {
  return (
    <div className="App">
      <header style={{ background: 'green', color: 'white', padding: '10px', textAlign: 'center' }}>
        <h1>Startup</h1>
      </header>
      <MapComponent />
    </div>
  );
}

export default App;
