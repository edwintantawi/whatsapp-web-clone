import { useStateValue } from 'context/stateProvider';
import { auth, provider } from 'services/firebase';
import { actionTypes } from 'context/reducer';

import './index.scss';

const Auth = () => {
  const [, dispatch] = useStateValue();
  return (
    <div className='login-buttons'>
      <div className='wrap'>
        <h1>Whatsapp Web Clone</h1>
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
              })
              .catch((error) => {
                console.log(error);
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
