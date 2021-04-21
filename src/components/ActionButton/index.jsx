import { Button } from '@material-ui/core';
import React from 'react';
import './index.scss';
const ActionButton = ({ text, action }) => {
  const handleAddFriend = () => {
    const itemTarget = document.querySelector(`#modal-ADD_FRIEND`);
    const modalLayer = document.querySelector(`#modal-layer`);
    itemTarget.classList.toggle('modal--active');
    modalLayer.classList.toggle('modal__layer--active');
  };

  return (
    <div className="actionButton">
      <Button
        className="actionButton__button"
        onClick={() => {
          switch (action) {
            case 'ADD_FRIEND':
              handleAddFriend();
              break;
            default:
              console.info('no handler');
              break;
          }
        }}
      >
        {text}
      </Button>
    </div>
  );
};

export default ActionButton;
