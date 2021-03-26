import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '@material-ui/core';
import './index.scss';
import { db } from 'services/firebase';
import { useStateValue } from 'context/stateProvider';
import { actionTypes } from 'context/reducer';

const ChatChannel = ({ id, name, avatar, isFriend, isGroup, onClick }) => {
  const [{ profile, friends }, dispatch] = useStateValue();
  const [lastMessage, setLastMessage] = useState([
    {
      name: 'whatsapp',
      message: 'Start Message Now...',
    },
  ]);

  const [channelData, setChannelData] = useState({});
  const [roomTarget, setRoomTarget] = useState('');
  const [reRoom, setReRoom] = useState(false);
  const [newRoom, setNewRoom] = useState(0);

  useEffect(() => {
    db.collection('rooms')
      .where('members', 'array-contains-any', [profile.uid, 'public'])
      .onSnapshot(() => {
        setNewRoom(Math.random(10));
      });
  }, [profile.uid]);

  useEffect(() => {
    console.info('ChatCannel effect');
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

    if (!isGroup) {
      const members = id.split('_');
      let friend = '';
      members.forEach((member) => {
        if (member !== profile.uid) {
          friend = member;
        }
      });

      if (friend !== profile.uid) {
        getFriend(friend)
          .then((data) => {
            setChannelData({
              friendName: data.displayname,
              friendAvatar: data.avatar,
            });
          })
          .catch((error) => console.error(error));

        friends.forEach((friendList) => {
          if (friendList.uid === friend) {
            setChannelData({
              friendName: friendList.displayname,
              friendAvatar: friendList.avatar,
            });
          }
        });
      }
    }

    if (isFriend) {
      const getRoom = async () => {
        const roomData = db.collection('rooms').doc(`${id}_${profile.uid}`);
        const data = await roomData.get();
        if (data.exists) {
          setReRoom(true);
        }
      };

      getRoom();
    }

    return () => {
      unSubscribeMessage();
    };
  }, [id, isFriend, isGroup, friends, newRoom, profile.uid]);

  useEffect(() => {
    if (reRoom) {
      setRoomTarget(`${id}_${profile.uid}`);
    } else {
      setRoomTarget(`${profile.uid}_${id}`);
    }
  }, [reRoom, id, newRoom, profile.uid]);

  const mobileHandleClick = () => {
    if (window.innerWidth < 885) {
      dispatch({
        type: actionTypes.SET_INCHAT,
        inChat: true,
      });
    }
  };

  const getFriend = async (uid) => {
    const friend = db.collection('users').doc(uid);
    const friendData = await friend.get();
    return friendData.data();
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
        to={`/room/${roomTarget}`}
        className={`chatchannel`}
        id={id}
        onClick={() => {
          mobileHandleClick();
          onClick();
        }}
      >
        <Avatar src={avatar} />
        <div className='chatchannel__info'>
          <span className='chatchannel__info__name'>{name}</span>
        </div>
      </Link>
    );
  }

  if (!isGroup) {
    return (
      <Link
        to={`/room/${id}`}
        className={`chatchannel`}
        id={id}
        onClick={mobileHandleClick}
      >
        <Avatar src={channelData.friendAvatar} />
        <div className='chatchannel__info'>
          <span className='chatchannel__info__name'>
            {channelData.friendName}
          </span>
          <span className='chatchannel__info__lastchat'>
            {lastMessage[0]?.message}
          </span>
        </div>
      </Link>
    );
  }
};

export default ChatChannel;
