import React, { useState } from 'react';
import MainChat from 'components/MainChat';
import SideChat from 'components/SideChat';
import Auth from 'components/Auth';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './App.scss';
import { useStateValue } from 'context/stateProvider';
import Lobby from 'components/Lobby';
import { useLayoutEffect } from 'react';
import firebase, { db } from 'services/firebase';
import { actionTypes } from 'context/reducer';
import LoadingScreen from 'components/LoadingScreen';

const App = () => {
  const [{ profile }, dispatch] = useStateValue();
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const getCurrentUser = async (uid) => {
          db.collection('users')
            .doc(uid)
            .onSnapshot((onSnapshot) => {
              const data = onSnapshot.data();
              dispatch({
                type: actionTypes.SET_PROFILE,
                profile: {
                  uid: data.uid,
                  avatar: data.avatar,
                  displayname: data.displayname,
                  username: data.username,
                  email: data.email,
                  friends: data.friends,
                },
              });
            });
        };

        const createUser = async (user) => {
          const currentUser = db.collection('users').doc(user.uid);
          const doc = await currentUser.get();
          if (!doc.exists) {
            console.log('user not found, added user to db');
            // added user to db
            const uniqcode0 = user.email.toUpperCase();
            const uniqcode1 = new Date().getMilliseconds();
            const uniqcode2 = new Date().getDay();
            const uniqcode3 = new Date().getMonth();
            const uniqcode4 = new Date().getFullYear();
            const username = `${uniqcode0[0]}${uniqcode1}${uniqcode2}${uniqcode3}${uniqcode4}`;
            db.collection('users')
              .doc(user.uid)
              .set({
                uid: user.uid,
                avatar: user.photoURL,
                displayname: user.displayName,
                username: username,
                email: user.email,
                friends: ['none'],
              });
            // user profile
            getCurrentUser(user.uid);
          } else {
            console.log('user found');
            // user profile
            getCurrentUser(user.uid);
          }
        };

        createUser(user);
      } else {
        setLoading(false);
      }
    });
  }, [dispatch]);

  return (
    <div className="app">
      {loading && <LoadingScreen />}
      {!profile.uid ? (
        <Auth />
      ) : (
        <Router basename="#">
          {loading && setLoading(false)}
          <SideChat />
          <Switch>
            <Route path="/room/:roomid">
              <MainChat />
            </Route>
            <Route path="/">
              <Lobby />
            </Route>
          </Switch>
        </Router>
      )}
    </div>
  );
};

export default App;
