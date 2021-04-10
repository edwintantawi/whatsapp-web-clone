import { IconButton } from '@material-ui/core';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import React from 'react';

import './index.scss';

const SideMenu = ({ id, title, children }) => {
  const toggleActive = (target) => {
    const targetElement = document.querySelector(`#${target}`);
    targetElement.classList.toggle('active');
  };

  return (
    <div className="sidemenu" id={id}>
      <div className="sidemenu__header">
        <div className="wrapper">
          <IconButton onClick={() => toggleActive(id)}>
            <KeyboardBackspaceIcon />
          </IconButton>
          <span className="title">{title}</span>
        </div>
      </div>
      {children}
    </div>
  );
};

export default SideMenu;
