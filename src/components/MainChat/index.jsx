import React from 'react';
import { Avatar, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import avatarPicture from 'assets/images/avatar.png';
import MoodIcon from '@material-ui/icons/Mood';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import './index.scss';
function MainChat() {
  return (
    <div className='mainchat'>
      <div className='mainchat__header'>
        <div className='mainchat__header__title'>
          <Avatar alt='Your Avatar' src={avatarPicture} />
          <div className='mainchat__header__title__text'>
            <span className='mainchat__header__title__text__name'>
              Lets Build a Futures
            </span>
            <span className='mainchat__header__title__text__description'>
              Me, 0828347912234, 823174902317, 238174092319
            </span>
          </div>
        </div>
        <div className='mainchat__header__icons'>
          <IconButton>
            <SearchIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      <div className='mainchat__chatarea'></div>

      <div className='mainchat__footer'>
        <div className='mainchat__footer__lefticon'>
          <IconButton>
            <MoodIcon />
          </IconButton>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
        </div>
        <div className='mainchat__footer__input'></div>
        <div className='mainchat__footer__righticon'></div>
      </div>
    </div>
  );
}

export default MainChat;
