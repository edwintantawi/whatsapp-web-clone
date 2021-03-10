import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '@material-ui/core';

// import avatarPicture from 'assets/images/avatar.png';

import './index.scss';
import { db } from 'services/firebase';
import { useStateValue } from 'context/stateProvider';
import { actionTypes } from 'context/reducer';

function ChatChannel({ className, id, name, avatar }) {
  const [{ user }, dispatch] = useStateValue();
  const [lastMessage, setLastMessage] = useState({
    from: 'whatsapp',
    message: 'Start Message Now...',
  });

  useEffect(() => {
    db.collection('rooms')
      .doc(id)
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapShot) => {
        setLastMessage(snapShot.docs.map((doc) => doc.data()));
      });
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
            lastMessage[0]?.email === user.email ? 'you' : lastMessage[0]?.name
          }: ${lastMessage[0]?.message}`}
        </span>
      </div>
    </Link>
  );
}

export default ChatChannel;
