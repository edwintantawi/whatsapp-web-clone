import React from 'react';
import './index.scss';
import whatsappIcon from '../../assets/whatsapp.svg';
import LockIcon from '@material-ui/icons/Lock';

const LoadingScreen = () => {
  return (
    <div className="loadingscreen">
      <div className="wrapper">
        <img
          src={whatsappIcon}
          alt="whatsapp"
          className="loadingscreen__icon"
        />
        <p>Whatsapp</p>
        <span>
          <LockIcon fontSize="small" /> End-To-End Encrypted
        </span>
      </div>
    </div>
  );
};

export default LoadingScreen;
