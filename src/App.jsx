import React from 'react';
import logo from './logo.svg';
import './App.css';
import Map from './components/Map';
import useMap from './hooks/useMap';
import FileButton from './components/FileButton';

const App = () => {

  const [map, setMap, randomMap, parseFileLoadMap] = useMap();

  return (
    <div className="App">
      <div className="App-menu">
        <FileButton
          text={"Load Map File"}
          onLoad={parseFileLoadMap}
        />
        <button
          className="button"
          onClick={() => setMap(randomMap)}
        >
          <p>load random map</p>
        </button>
      </div>
      <div className="App-content">
        <div className="score" />
        <Map
          stage={map.stage}
          height={map.stage && map.stage.length}
          width={map.stage[0] && map.stage[0].length}
        />
      </div>
      <div className="App-control">
        <button className="button">
          <p>start/play</p>
        </button>
        <button className="button">
          <p>pause</p>
        </button>
        <button className="button">
          <p>fastforward</p>
        </button>
        <button className="button">
          <p>result</p>
        </button>
      </div>
    </div>
  );
}
export default App;
