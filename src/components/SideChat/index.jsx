import React from 'react';
import { Avatar, IconButton } from '@material-ui/core';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';

import avatarPicture from 'assets/images/avatar.png';
import './index.scss';
import ChatChannel from 'components/ChatChannel';

function SideChat() {
  return (
    <div className='sidechat'>
      <div className='sidechat__header'>
        <Avatar alt='Your Avatar' src={avatarPicture} />
        <div className='sidechat__header__icons'>
          <IconButton>
            <DonutLargeIcon className='button' />
          </IconButton>
          <IconButton>
            <ChatIcon className='button' />
          </IconButton>
          <IconButton>
            <MoreVertIcon className='button' />
          </IconButton>
        </div>
      </div>

      <div className='sidechat__search'>
        <div className='sidechat__search__input'>
          <SearchIcon className='button' />
          <input
            type='text'
            name='search'
            id='search'
            placeholder='Search or start a new chat'
          />
        </div>
      </div>

      <div className='sidechat__chatlist'>
        <ChatChannel className='active' />
        <ChatChannel />
        <ChatChannel />
        <ChatChannel />
        <ChatChannel />
        <ChatChannel />

        <ChatChannel />
        <ChatChannel />
        <ChatChannel />
        <ChatChannel />
        <ChatChannel />
        <ChatChannel />
        <ChatChannel />

        <ChatChannel />
        <ChatChannel />
        <ChatChannel />
        <ChatChannel />
        <ChatChannel />
        <ChatChannel />
        <ChatChannel />

        <ChatChannel />
        <ChatChannel />
        <ChatChannel />
        <ChatChannel />
        <ChatChannel />
        <ChatChannel />
        <ChatChannel />

        <ChatChannel />
        <ChatChannel />
        <ChatChannel />
        <ChatChannel />
        <ChatChannel />
        <ChatChannel />
        <ChatChannel />

        <ChatChannel />
      </div>
    </div>
  );
}

export default SideChat;
