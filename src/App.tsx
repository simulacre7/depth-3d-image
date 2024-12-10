import Interactive3DImage from './Interactive3DImage';
import './App.css';
import pikachu from './assets/pikachu.jpg';
import pikachuDepthMap from './assets/pikachu.map.jpg';

function App() {
  return (
    <>
      <Interactive3DImage
        image={pikachu}
        depthMap={pikachuDepthMap}
        intensity={20}
      />
      <div style={{ display: 'flex' }}>
        <img src={pikachu} style={{ width: '50%' }} />
        <img src={pikachuDepthMap} style={{ width: '50%' }} />
      </div>
    </>
  );
}

export default App;
