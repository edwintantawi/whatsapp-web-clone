import React, { useState, useEffect, useRef } from 'react';
import firebase from '../../services/firebase';
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
  const [roomInfo, setRoomInfo] = useState('');
  const [messages, setMessages] = useState([]);
  const [{ profile, inChat, friends }, dispatch] = useStateValue();
  const [messageInput, setInput] = useState('');
  const chatArea = useRef(null);

  useEffect(() => {
    chatArea.current.scrollTo(0, chatArea.current.scrollHeight + 62);
  });

  useEffect(() => {
    console.info('MainChat effect');
    if (roomid) {
      // create room
      const unSubscribedRoomHeader = db
        .collection('rooms')
        .doc(roomid)
        .onSnapshot((snapShot) => {
          const data = snapShot.data();
          if (data?.isgroup === true) {
            setRoomInfo(data);
            // setRoomName(data.name);
            // setRoomAvatar(data.avatar);

            // db.collection('rooms')
            //   .doc(roomid)
            //   .set({
            //     members: ['public'],
            //   });
          } else {
            const members = roomid.split('_');
            let friend = '';
            let friendUid = [];
            members.forEach((member) => {
              if (member !== profile.uid) {
                friend = member;
              }
            });

            friends.forEach((friend) => {
              friendUid.push(friend.uid);
            });

            if (friend !== profile.uid) {
              getFriend(friend).then((data) => {
                setRoomInfo({
                  avatar: data.avatar,
                  name: data.displayname,
                  friendUid: data.uid,
                  newFriend: !friendUid.includes(data.uid),
                });
              });
            }

            const createRoom = async () => {
              const currentRoom = db.collection('rooms').doc(roomid);
              const doc = await currentRoom.get();

              if (!doc.exists) {
                db.collection('rooms').doc(roomid).set({
                  members: members,
                  isgroup: false,
                });
              }
            };

            createRoom();
          }
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
  }, [roomid, friends, profile.uid]);

  const getFriend = async (uid) => {
    const friend = db.collection('users').doc(uid);
    const friendData = await friend.get();
    return friendData.data();
  };

  const addFriend = () => {
    db.collection('users')
      .doc(profile.uid)
      .update({
        friends: firebase.firestore.FieldValue.arrayUnion(roomInfo.friendUid),
      });
  };

  const sendMessage = () => {
    if (messageInput !== '') {
      db.collection('rooms').doc(roomid).collection('messages').add({
        uid: profile.uid,
        name: profile.displayname,
        message: messageInput,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });

      db.collection('rooms').doc(roomid).set(
        {
          lastMessage: firebase.firestore.FieldValue.serverTimestamp(),
        },
        {
          merge: true,
        }
      );
    }
  };

  const twoDigitsTime = (time) => {
    let timePlaceholder = '';
    time < 10 ? (timePlaceholder += `0${time}`) : (timePlaceholder += time);
    return timePlaceholder;
  };

  const handleTimestamp = (data, sending) => {
    let newTimestamp = '';
    const time = new Date(data?.timestamp?.seconds * 1000);
    newTimestamp = `${twoDigitsTime(time.getHours())}:${twoDigitsTime(
      time.getMinutes()
    )}`;

    if (newTimestamp === 'NaN:NaN') {
      if (sending) {
        const nowDate = new Date();
        return `${twoDigitsTime(nowDate.getHours())}:${twoDigitsTime(
          nowDate.getMinutes()
        )} sending...`;
      }

      return 'Start Message now...';
    }

    if (!sending) {
      return `last seen at ${newTimestamp}`;
    }

    return newTimestamp;
  };

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
              {`${handleTimestamp(messages[messages.length - 1])}`}
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
            username={roomInfo.isgroup ? message.name : null}
            message={message.message}
            timestamp={handleTimestamp(message, true)}
            myMessage={message.uid === profile.uid ? true : false}
          />
        ))}
      </div>

      {roomInfo.newFriend ? (
        <div className="mainchat__addfriend">
          <h2>{`You with ${roomInfo.name} Not a Friend now`}</h2>
          <p>add to your Friend list?</p>
          <button onClick={addFriend}>Add Friend</button>
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
            sendMessage();
            setInput('');
          }}
        >
          <input
            type="text"
            name="message"
            id="message"
            placeholder="Type a message"
            value={messageInput}
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
