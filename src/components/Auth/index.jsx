import React from 'react';
import { useStateValue } from 'context/stateProvider';
import firebase, { auth, db, provider } from 'services/firebase';
import { actionTypes } from 'context/reducer';

import './index.scss';

const Auth = () => {
  const [, dispatch] = useStateValue();

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

  const handleLoginClick = () => {
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
      auth
        .signInWithPopup(provider)
        .then((results) => {
          createUser(results.user);
        })
        .catch((error) => {
          console.error(error);
        });
    });
  };

  return (
    <div className="login-buttons">
      <div className="wrap">
        <h1>Whatsapp Web Clone</h1>
        <p>Powered by: ReactJS, MaterialUI, Firebase</p>
        <button className="login-provider-button" onClick={handleLoginClick}>
          <img
            src="https://img.icons8.com/fluent/28/000000/google-logo.png"
            alt="google auth"
          />
          <span> Continue with Google</span>
        </button>
      </div>
    </div>
  );
};

export default Auth;
