import MainChat from 'components/MainChat';
import SideChat from 'components/SideChat';
import './App.scss';

function App() {
  return (
    <div className='app'>
      <SideChat />
      <MainChat />
    </div>
  );
}

export default App;
