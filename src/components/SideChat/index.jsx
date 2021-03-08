import React from 'react';
import { Avatar, IconButton } from '@material-ui/core';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import avatarPicture from 'assets/images/avatar.png';
import './index.scss';

function SideChat() {
  return (
    <div className='sidechat'>
      <div className='sidechat__header'>
        <Avatar alt='Remy Sharp' src={avatarPicture} />
        <div className='sidechat__header__icons'>
          <IconButton>
            <DonutLargeIcon />
          </IconButton>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className='sidechat__search'></div>
      <div className='sidebar__chatlist'></div>
    </div>
  );
}

export default SideChat;
