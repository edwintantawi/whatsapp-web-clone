import React from 'react';
import MainChat from 'components/MainChat';
import SideChat from 'components/SideChat';
import Auth from 'components/Auth';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './App.scss';
import { useStateValue } from 'context/stateProvider';
import Lobby from 'components/Lobby';

function App() {
  const [{ user }] = useStateValue();
  return (
    <div className='app'>
      {!user ? (
        <Auth />
      ) : (
        // <div className='app-body'>
        <Router>
          <SideChat />
          <Switch>
            <Route path='/room/:roomid'>
              <MainChat />
            </Route>
            <Route path='/'>
              <Lobby />
            </Route>
          </Switch>
        </Router>
        // </div>
      )}
    </div>
  );
}

export default App;
