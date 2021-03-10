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

  return (
    <div className={`sidechat ${inChat ? '' : 'active'}`}>
      <div className='sidechat__header'>
        <Avatar alt='Your Avatar' src={user.photoURL} />
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
        {rooms.map((room) => (
          <ChatChannel
            key={room.id}
            id={room.id}
            name={room.data.name}
            avatar={room.data.avatar}
          />
        ))}
      </div>
    </div>
  );
}

export default SideChat;
