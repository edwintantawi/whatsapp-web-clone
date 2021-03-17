import { useStateValue } from 'context/stateProvider';
import { auth, db, provider } from 'services/firebase';
import { actionTypes } from 'context/reducer';

import './index.scss';

const Auth = () => {
  const [, dispatch] = useStateValue();

  const createUser = (user) => {
    db.collection('users')
      .where('email', 'in', [user.email])
      .onSnapshot((snapShot) => {
        const status = snapShot.empty;

        if (status) {
          const uniqcode0 = user.email.toUpperCase();
          const uniqcode1 = new Date().getMilliseconds();
          const uniqcode2 = new Date().getDay();
          const uniqcode3 = new Date().getMonth();
          const uniqcode4 = new Date().getFullYear();
          const username = `${uniqcode0[0]}${uniqcode1}${uniqcode2}${uniqcode3}${uniqcode4}`;
          db.collection('users').add({
            avatar: user.photoURL,
            displayname: user.displayName,
            username: username,
            email: user.email,
            friends: ['edwintantawi@gmail.com'],
          });
        }
      });
  };

  return (
    <div className='login-buttons'>
      <div className='wrap'>
        <h1>Whatsapp Web Clone</h1>
        <p>Powered by: ReactJS, MaterialUI, Firebase</p>
        <button
          className='login-provider-button'
          onClick={() => {
            auth
              .signInWithPopup(provider)
              .then((results) => {
                dispatch({
                  type: actionTypes.SET_USER,
                  user: results.user,
                });
                createUser(results.user);
              })
              .catch((error) => {
                console.error(error);
              });
          }}
        >
          <img
            src='https://img.icons8.com/fluent/28/000000/google-logo.png'
            alt='google auth'
          />
          <span> Continue with Google</span>
        </button>
      </div>
    </div>
  );
};

export default Auth;
