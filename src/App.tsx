import Interactive3DImage from './Interactive3DImage';
import './App.css';
import pikachu from './assets/pikachu.jpg';
import pikachuDepthMap from './assets/pikachu.map.jpg';

function App() {
  return <Interactive3DImage image={pikachu} depthMap={pikachuDepthMap} />;
}

export default App;
