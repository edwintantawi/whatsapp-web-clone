import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '@material-ui/core';
import avatarPicture from 'assets/images/avatar.png';

import './index.scss';
import { db } from 'services/firebase';

function ChatChannel({ className, id, name }) {
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

  return (
    <Link to={`/room/${id}`} className={`chatchannel`} id={id}>
      <Avatar src={avatarPicture} />
      <div className='chatchannel__info'>
        <span className='chatchannel__info__name'>{name}</span>
        <span className='chatchannel__info__lastchat'>
          {`${lastMessage[0]?.name}: ${lastMessage[0]?.message}`}
        </span>
      </div>
    </Link>
  );
}

export default ChatChannel;
