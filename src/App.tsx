import React from 'react';
import GoogleMapsLoader from './components/GoogleMapsLoader';
import Game from './components/Game';
import './index.css';

function App() {
  return (
    <div className="App">
      <GoogleMapsLoader>
        <Game />
      </GoogleMapsLoader>
    </div>
  );
}

export default App;
