import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '@material-ui/core';

// import avatarPicture from 'assets/images/avatar.png';

import './index.scss';
import { db } from 'services/firebase';
import { useStateValue } from 'context/stateProvider';
import { actionTypes } from 'context/reducer';

const ChatChannel = ({ className, id, name, avatar, isFriend }) => {
  const [{ profile }, dispatch] = useStateValue();
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

  return (
    <Link
      to={!isFriend ? `/room/${id}` : ''}
      className={`chatchannel`}
      id={id}
      onClick={mobileHandleClick}
    >
      <Avatar src={avatar} />
      <div className='chatchannel__info'>
        <span className='chatchannel__info__name'>{name}</span>
        <span className='chatchannel__info__lastchat'>
          {!isFriend
            ? `${
                lastMessage[0]?.uid === profile.uid
                  ? 'you'
                  : lastMessage[0]?.name
              }: ${lastMessage[0]?.message}`
            : null}
        </span>
      </div>
    </Link>
  );
};

export default ChatChannel;
