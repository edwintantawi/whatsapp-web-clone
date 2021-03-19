import React, { useState, useEffect, useRef } from 'react';
import firebase from 'firebase/app';
import { Avatar, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MoodIcon from '@material-ui/icons/Mood';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MicIcon from '@material-ui/icons/Mic';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import './index.scss';
import ChatBubble from 'components/ChatBubble';
import { useParams } from 'react-router-dom';
import { db } from 'services/firebase';
import { useStateValue } from 'context/stateProvider';
import { actionTypes } from 'context/reducer';

const MainChat = () => {
  const { roomid } = useParams();
  const [roomName, setRoomName] = useState('');
  const [roomAvatar, setRoomAvatar] = useState('');
  const [messages, setMessages] = useState([]);
  const [{ profile, inChat }, dispatch] = useStateValue();
  const [messageInput, setInput] = useState('');
  const chatArea = useRef(null);

  useEffect(() => {
    chatArea.current.scrollTo(0, chatArea.current.scrollHeight + 62);
  });

  useEffect(() => {
    if (roomid) {
      const unSubscribedRoomHeader = db
        .collection('rooms')
        .doc(roomid)
        .onSnapshot((snapShot) => {
          setRoomName(snapShot.data().name);
          setRoomAvatar(snapShot.data().avatar);
        });

      const unSubscribedMessage = db
        .collection('rooms')
        .doc(roomid)
        .collection('messages')
        .orderBy('timestamp', 'asc')
        .onSnapshot((snapShot) =>
          setMessages(snapShot.docs.map((doc) => doc.data()))
        );

      return () => {
        unSubscribedMessage();
        unSubscribedRoomHeader();
      };
    }
  }, [roomid]);

  const sendMessage = () => {
    if (messageInput !== '') {
      db.collection('rooms').doc(roomid).collection('messages').add({
        uid: profile.uid,
        name: profile.displayname,
        message: messageInput,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
  };

  const handleTimestamp = (data) => {
    let newTimestamp = '';
    const time = new Date(data?.timestamp?.seconds * 1000);
    const hours = time.getHours();
    const minutes = time.getMinutes();
    hours < 10 ? (newTimestamp += `0${hours}`) : (newTimestamp += hours);
    newTimestamp += ':';
    minutes < 10 ? (newTimestamp += `0${minutes}`) : (newTimestamp += minutes);

    return newTimestamp;
  };

  return (
    <div className={`mainchat ${inChat ? 'active' : ''}`}>
      <div className='mainchat__header'>
        <div className='mainchat__header__title'>
          <div
            id='back'
            onClick={() => {
              dispatch({
                type: actionTypes.SET_INCHAT,
                inChat: false,
              });
            }}
          >
            <IconButton>
              <KeyboardBackspaceIcon />
            </IconButton>
          </div>
          <Avatar alt='Your Avatar' src={roomAvatar} />
          <div className='mainchat__header__title__text'>
            <span className='mainchat__header__title__text__name'>
              {roomName}
            </span>
            <span className='mainchat__header__title__text__description'>
              {`last seen at ${handleTimestamp(messages[messages.length - 1])}`}
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

      <div className='mainchat__chatarea' ref={chatArea}>
        {messages.map((message, idx) => (
          <ChatBubble
            key={idx}
            username={message.name}
            message={message.message}
            timestamp={handleTimestamp(message)}
            myMessage={message.uid === profile.uid ? true : false}
          />
        ))}
      </div>

      <div className='mainchat__footer'>
        <div className='mainchat__footer__lefticon'>
          <IconButton>
            <MoodIcon />
          </IconButton>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
        </div>
        <div className='mainchat__footer__input'>
          <input
            type='text'
            name='message'
            id='message'
            placeholder='Type a message'
            value={messageInput}
            onChange={(e) => setInput(e.target.value)}
            onKeyUp={(e) => {
              if (e.keyCode === 13) {
                e.preventDefault();
                sendMessage();
                setInput('');
              }
            }}
          />
        </div>
        <div className='mainchat__footer__righticon'>
          <IconButton>
            <MicIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default MainChat;
