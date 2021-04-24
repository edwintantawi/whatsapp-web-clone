// React
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
// context
import { useStateValue } from 'context/stateProvider';
import { actionTypes } from 'context/reducer';
// Helper
import {
  getRoomInfo,
  getRoomMessages,
  addFriend,
  sendMessage,
} from 'helper/firebaseHelper';
import { handleTimeStamp } from 'helper/globalHelper';
// Material UI & Icons
import { Avatar, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MoodIcon from '@material-ui/icons/Mood';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MicIcon from '@material-ui/icons/Mic';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import ChatBubble from 'components/ChatBubble';
// style
import './index.scss';
// components
const MainChat = () => {
  const { roomid } = useParams();
  const [roomInfo, setRoomInfo] = useState('');
  const [messages, setMessages] = useState([]);
  const [{ profile, inChat, friends }, dispatch] = useStateValue();
  const [input, setInput] = useState('');
  const chatArea = useRef(null);
  const inputArea = useRef(null);

  useEffect(() => {
    chatArea.current.scrollTo(0, chatArea.current.scrollHeight + 62);
  });

  useEffect(() => {
    const inputFocus = () => {
      inputArea.current.focus();
    };
    document.addEventListener('keypress', inputFocus);
    return () => {
      document.removeEventListener('keypress', inputFocus);
    };
  }, [roomid]);

  useEffect(() => {
    console.info('MainChat effect : get Room Info');
    getRoomInfo(roomid, profile, friends).then((roomHeader) => {
      setRoomInfo(roomHeader);
    });
  }, [roomid, friends, profile]);

  useEffect(() => {
    console.info('MainChat effect : get Room Messages');
    const un_getRoomMessages = getRoomMessages(roomid).onSnapshot(
      (snapshot) => {
        setMessages(snapshot.docs.map((doc) => doc.data()));
      }
    );
    return () => {
      un_getRoomMessages();
    };
  }, [roomid]);

  return (
    <div className={`mainchat ${inChat ? 'active' : ''}`}>
      <div className="mainchat__header">
        <div className="mainchat__header__title">
          <div
            id="back"
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
          <Avatar alt="Your Avatar" src={roomInfo.avatar} />
          <div className="mainchat__header__title__text">
            <span className="mainchat__header__title__text__name">
              {roomInfo.name}
            </span>
            <span className="mainchat__header__title__text__description">
              {`${handleTimeStamp(messages[messages.length - 1]?.timestamp)}`}
            </span>
          </div>
        </div>
        <div className="mainchat__header__icons">
          <IconButton>
            <SearchIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      <div className="mainchat__chatarea" ref={chatArea}>
        {messages.map((message, idx) => (
          <ChatBubble
            key={idx}
            username={roomInfo.isgroup && message.name}
            message={message.message}
            timestamp={handleTimeStamp(message?.timestamp, true)}
            myMessage={message.uid === profile.uid ? true : false}
          />
        ))}
      </div>

      {roomInfo.newFriend ? (
        <div className="mainchat__addfriend">
          <h2>{`You with ${roomInfo.name} Not a Friend now`}</h2>
          <p>add to your Friend list?</p>
          <button onClick={() => addFriend(profile.uid, roomInfo.uid)}>
            Add Friend
          </button>
        </div>
      ) : null}

      <div className="mainchat__footer">
        <div className="mainchat__footer__lefticon">
          <IconButton>
            <MoodIcon />
          </IconButton>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
        </div>
        <form
          className="mainchat__footer__input"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(roomid, profile, input);
            setInput('');
          }}
        >
          <input
            type="text"
            name="message"
            id="message"
            ref={inputArea}
            placeholder="Type a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" style={{ display: 'none' }}></button>
        </form>
        <div className="mainchat__footer__righticon">
          <IconButton>
            <MicIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default MainChat;
