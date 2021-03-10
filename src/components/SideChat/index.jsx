import React, { useEffect, useState } from 'react';
import { Avatar, IconButton } from '@material-ui/core';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import ChatChannel from 'components/ChatChannel';
import { db } from 'services/firebase';
import { useStateValue } from 'context/stateProvider';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import './index.scss';

import avatar from 'assets/images/avatar.png';

function SideChat() {
  const [rooms, setRooms] = useState([]);
  const [{ user, inChat }] = useStateValue();

  useEffect(() => {
    db.collection('rooms').onSnapshot((snapShot) => {
      setRooms(
        snapShot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
  }, []);

  const toggleActive = (target) => {
    const targetElement = document.querySelector(`.${target}`);
    targetElement.classList.toggle('active');
  };

  const menuActionButton = ({ target }) => {
    const action = target.dataset.action;

    switch (action) {
      case 'NEW_GROUP_CHAT':
        // pop up friend list

        // create group name and picture

        // click many friends and create a group chat

        break;
      case 'NEW_PRIVATE_CHAT':
        // pop up friend list

        // click some friends and create a private chat
        break;
      default:
        break;
    }
  };

  return (
    <div className={`sidechat ${inChat ? '' : 'active'}`}>
      <div className='sidechat__header'>
        <Avatar alt='Your Avatar' src={user.photoURL} />
        <div className='sidechat__header__icons'>
          <IconButton>
            <DonutLargeIcon className='button' />
          </IconButton>
          <IconButton onClick={() => toggleActive('sidemenu__newchat')}>
            <ChatIcon className='button' />
          </IconButton>
          <IconButton onClick={() => toggleActive('menu__list')}>
            <MoreVertIcon className='button' />
          </IconButton>

          <ul className='menu__list'>
            <li data-action='GROUP_CHAT' onClick={(e) => menuActionButton(e)}>
              New Group
            </li>
            <li data-action='ROOM' onClick={(e) => menuActionButton(e)}>
              Create Room
            </li>
            <li data-action='PROFILE' onClick={(e) => menuActionButton(e)}>
              Profile
            </li>
            <li data-action='CATALOG' onClick={(e) => menuActionButton(e)}>
              Catalog
            </li>
            <li data-action='ARCHIVED' onClick={(e) => menuActionButton(e)}>
              Archived
            </li>
            <li data-action='STARRED' onClick={(e) => menuActionButton(e)}>
              Stared
            </li>
            <li data-action='LABELS' onClick={(e) => menuActionButton(e)}>
              Labels
            </li>
            <li data-action='SETTINGS' onClick={(e) => menuActionButton(e)}>
              Settings
            </li>

            <li data-action='LOGOUT' onClick={(e) => menuActionButton(e)}>
              Logout
            </li>
          </ul>
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
        {rooms.map((room) => (
          <ChatChannel
            key={room.id}
            id={room.id}
            name={room.data.name}
            avatar={room.data.avatar}
          />
        ))}
      </div>

      {/* side menu */}
      <div className='sidemenu__newchat'>
        <div className='sidemenu__newchat__header'>
          <div className='wrapper'>
            <IconButton onClick={() => toggleActive('sidemenu__newchat')}>
              <KeyboardBackspaceIcon />
            </IconButton>
            <span className='title'>New Chat</span>
          </div>
        </div>
        <ChatChannel
          id='friend id'
          name='Your Friend'
          avatar={avatar}
          isFriend
        />
        <ChatChannel
          id='friend id'
          name='Your Friend'
          avatar={avatar}
          isFriend
        />
        <ChatChannel
          id='friend id'
          name='Your Friend'
          avatar={avatar}
          isFriend
        />
      </div>
    </div>
  );
}

export default SideChat;
