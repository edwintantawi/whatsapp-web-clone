import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '@material-ui/core';
import './index.scss';
import { db } from 'services/firebase';
import { useStateValue } from 'context/stateProvider';
import { actionTypes } from 'context/reducer';

const ChatChannel = ({ id, name, avatar, isFriend, isGroup }) => {
  const [{ profile, friends }, dispatch] = useStateValue();
  const [lastMessage, setLastMessage] = useState([
    {
      name: 'whatsapp',
      message: 'Start Message Now...',
    },
  ]);
  useEffect(() => {
    const unSubscribeMessage = db
      .collection('rooms')
      .doc(id)
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapShot) => {
        if (!snapShot.empty) {
          setLastMessage(snapShot.docs.map((doc) => doc.data()));
        }
      });

    return () => {
      unSubscribeMessage();
    };
  }, [id]);

  const mobileHandleClick = () => {
    if (window.innerWidth < 885) {
      dispatch({
        type: actionTypes.SET_INCHAT,
        inChat: true,
      });
    }
  };

  if (isGroup) {
    return (
      <Link
        to={`/room/${id}`}
        className={`chatchannel`}
        id={id}
        onClick={mobileHandleClick}
      >
        <Avatar src={avatar} />
        <div className='chatchannel__info'>
          <span className='chatchannel__info__name'>{name}</span>
          <span className='chatchannel__info__lastchat'>
            {`${
              lastMessage[0]?.uid === profile.uid ? 'you' : lastMessage[0]?.name
            }: ${lastMessage[0]?.message}`}
          </span>
        </div>
      </Link>
    );
  }

  if (isFriend) {
    return (
      <Link
        to={`/room/${profile.uid}_${id}`}
        className={`chatchannel`}
        id={id}
        onClick={() => mobileHandleClick}
      >
        <Avatar src={avatar} />
        <div className='chatchannel__info'>
          <span className='chatchannel__info__name'>{name}</span>
        </div>
      </Link>
    );
  }

  if (!isGroup) {
    const members = id.split('_');
    let friendName = 'Unknow';
    let friendAvatar = '';

    members.forEach((member) => {
      if (member !== profile.uid) {
        friends.forEach((friend) => {
          if (friend.uid === member) {
            friendName = friend.displayname;
            friendAvatar = friend.avatar;
          }
        });
      }
    });

    return (
      <Link
        to={`/room/${id}`}
        className={`chatchannel`}
        id={id}
        onClick={mobileHandleClick}
      >
        <Avatar src={friendAvatar} />
        <div className='chatchannel__info'>
          <span className='chatchannel__info__name'>{friendName}</span>
          <span className='chatchannel__info__lastchat'>
            {`${
              lastMessage[0]?.uid === profile.uid ? 'you' : lastMessage[0]?.name
            }: ${lastMessage[0]?.message}`}
          </span>
        </div>
      </Link>
    );
  }
};

export default ChatChannel;
