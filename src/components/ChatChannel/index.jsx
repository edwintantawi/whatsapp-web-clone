import React from 'react';
import { Avatar } from '@material-ui/core';
import avatarPicture from 'assets/images/avatar.png';

import './index.scss';

function ChatChannel({ className, ...props }) {
  return (
    <div className={`chatchannel ${className}`}>
      <Avatar src={avatarPicture} />
      <div className='chatchannel__info'>
        <span className='chatchannel__info__name'>Lets Build a Futures</span>
        <span className='chatchannel__info__lastchat'>
          You: Hi nice to meet you...
        </span>
      </div>
    </div>
  );
}

export default ChatChannel;
