import React, { useEffect, useState } from 'react';
import { Avatar, IconButton } from '@material-ui/core';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import ChatChannel from 'components/ChatChannel';
import { db } from 'services/firebase';
import { useStateValue } from 'context/stateProvider';
import './index.scss';

import SideMenu from 'components/SideMenu';
import { actionTypes } from 'context/reducer';

function SideChat() {
  const [rooms, setRooms] = useState([]);
  const [friendsList, setFriends] = useState([
    { displayname: 'hantu' },
    { displayname: 'bebek' },
  ]);
  const [{ user, inChat, profile }, dispatch] = useStateValue();

  useEffect(() => {
    db.collection('rooms').onSnapshot((snapShot) => {
      setRooms(
        snapShot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
    // user profile
    db.collection('users')
      .where('email', 'in', [user.email])
      .onSnapshot((snapShot) => {
        snapShot.docs.forEach((doc) => {
          const data = doc.data();
          dispatch({
            type: actionTypes.SET_PROFILE,
            profile: {
              avatar: data.avatar,
              displayname: data.displayname,
              username: data.username,
              email: data.email,
              friends: data.friends,
            },
          });
        });
      });
  }, [user.email, dispatch]);

  useEffect(() => {
    db.collection('users')
      .where('email', 'in', profile.friends)
      .onSnapshot((snapShot) => {
        setFriends(snapShot.docs.map((doc) => doc.data()));
      });
  }, [profile.friends]);

  const toggleActive = (target) => {
    const targetElement = document.querySelector(`#${target}`);
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
        <Avatar
          alt='Your Avatar'
          src={user.photoURL}
          onClick={() => toggleActive('profile')}
        />
        <div className='sidechat__header__icons'>
          <IconButton>
            <DonutLargeIcon className='button' />
          </IconButton>
          <IconButton onClick={() => toggleActive('newchat')}>
            <ChatIcon className='button' />
          </IconButton>
          <IconButton onClick={() => toggleActive('menulist')}>
            <MoreVertIcon className='button' />
          </IconButton>

          <ul className='menu__list' id='menulist'>
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
      <SideMenu title='New Chat' id='newchat'>
        {friendsList.map((friend, idx) => (
          <ChatChannel
            key={idx}
            name={friend.displayname}
            avatar={friend.avatar}
            isFriend
          />
        ))}
      </SideMenu>

      <SideMenu title='Profile' id='profile'>
        <div className='profile__section'>
          <div
            className='profile__avatar'
            style={{ padding: '28px 0', display: 'grid', placeItems: 'center' }}
          >
            <Avatar
              src={profile.avatar}
              style={{ width: '200px', height: '200px' }}
            />
          </div>

          <div className='section__menu'>
            <div className='section__menu__title'>
              <span>Your Name</span>
            </div>
            <div className='section__menu__data'>
              <span>{profile.displayname}</span>
            </div>
          </div>

          <div className='section__menu'>
            <div className='section__menu__title'>
              <span>Username</span>
            </div>
            <div className='section__menu__data'>
              <span>{`@${profile.username}`}</span>
            </div>
          </div>
        </div>
      </SideMenu>
    </div>
  );
}

export default SideChat;
