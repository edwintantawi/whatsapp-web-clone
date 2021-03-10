import React, { useState, useEffect, useRef } from 'react';
import firebase from 'firebase/app';
import { Avatar, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import avatarPicture from 'assets/images/avatar.png';
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

function MainChat() {
  const { roomid } = useParams();
  const [roomName, setRoomName] = useState('');
  const [messages, setMessages] = useState([]);
  const [{ user, inChat }, dispatch] = useStateValue();
  const [messageInput, setInput] = useState('');
  const chatArea = useRef(null);

  useEffect(() => {
    chatArea.current.scrollTo(0, chatArea.current.scrollHeight);
  });

  useEffect(() => {
    if (roomid) {
      db.collection('rooms')
        .doc(roomid)
        .onSnapshot((snapShot) => {
          setRoomName(snapShot.data().name);
        });

      db.collection('rooms')
        .doc(roomid)
        .collection('messages')
        .orderBy('timestamp', 'asc')
        .onSnapshot((snapShot) => {
          setMessages(snapShot.docs.map((doc) => doc.data()));
        });
    }
  }, [roomid]);

  const sendMessage = () => {
    if (messageInput !== '') {
      db.collection('rooms').doc(roomid).collection('messages').add({
        email: user.email,
        name: user.displayName,
        message: messageInput,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
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
          <Avatar alt='Your Avatar' src={avatarPicture} />
          <div className='mainchat__header__title__text'>
            <span className='mainchat__header__title__text__name'>
              {roomName}
            </span>
            <span className='mainchat__header__title__text__description'>
              last seen today
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
            timestamp={`${new Date(message.timestamp?.seconds * 1000)
              .getHours()
              .toLocaleString()}${
              new Date(message.timestamp?.seconds * 1000)
                .getMinutes()
                .toLocaleString() < 10
                ? ':0'
                : ':'
            }${
              new Date(message.timestamp?.seconds * 1000)
                .getMinutes()
                .toLocaleString() || ''
            }`}
            myMessage={message.email === user.email ? true : false}
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
}

export default MainChat;
