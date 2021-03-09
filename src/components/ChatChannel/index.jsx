import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '@material-ui/core';
import avatarPicture from 'assets/images/avatar.png';

import './index.scss';

function ChatChannel({ className, id, name }) {
  return (
    <Link to={`/room/${id}`} className={`chatchannel`} id={id}>
      <Avatar src={avatarPicture} />
      <div className='chatchannel__info'>
        <span className='chatchannel__info__name'>{name}</span>
        <span className='chatchannel__info__lastchat'>
          You: Hi nice to meet you...
        </span>
      </div>
    </Link>
  );
}

export default ChatChannel;
