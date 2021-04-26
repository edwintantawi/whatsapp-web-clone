import firebase, { db } from 'services/firebase';

export const getRoomById = (roomid) => {
  return db.collection('rooms').doc(roomid);
};

export const getRoomMessages = (roomid) => {
  return getRoomById(roomid).collection('messages').orderBy('timestamp', 'asc');
};

// export const getRoom = (roomid, profile, friends) => {
//   return new Promise((resolve) => {
//     getRoomById(roomid).onSnapshot((snapshot) => {
//       const roomData = snapshot.data();
//       if (roomData?.isgroup) {
//         resolve(roomData);
//       } else {
//         // split url room id to get member uid's
//         const roomMembers = roomid.split('_');
//         let roomFriendUid = '';
//         let friendUidList = [];
//         // check if member from room id is not self, its your friend
//         roomMembers.forEach((member) => {
//           member !== profile.uid && (roomFriendUid = member);
//         });
//         // get all friendlist uid
//         friends.forEach((friend) => {
//           friendUidList.push(friend.uid);
//         });
//         // create room if not exist
//         createRoom(roomid, roomMembers);
//         // set the room header
//         getFriendData(roomFriendUid).then((friendData) => {
//           const roomFriendData = {
//             avatar: friendData.avatar,
//             name: friendData.displayname,
//             uid: friendData.uid,
//             newFriend: !friendUidList.includes(friendData.uid),
//           };
//           resolve(roomFriendData);
//         });
//       }
//     });
//   });
// };

export const getRoomInfo = (roomid, profile, friends) => {
  // split url room id to get member uid's
  const roomMembers = roomid.split('_');
  let roomFriendUid = '';
  let roomMeUid = '';
  let friendUidList = [];
  let isRoomValid = false;

  // check if member from room id is not self, its your friend
  roomMembers.forEach((member) => {
    member !== profile.uid ? (roomFriendUid = member) : (roomMeUid = member);
  });

  // get all friendlist uid
  friends.forEach((friend) => {
    friendUidList.push(friend.uid);
    if (friend.uid === roomFriendUid) {
      isRoomValid = true;
    }
  });

  if (roomMeUid !== profile.uid) {
    isRoomValid = false;
  }

  // create room if not exist and valid
  if (isRoomValid) {
    createRoom(roomid, roomMembers, profile, friends);
  }
  // set the room header by friend
  return getFriendData(roomFriendUid).then((friendData) => {
    const roomFriendData = {
      avatar: friendData.avatar,
      name: friendData.displayname,
      uid: friendData.uid,
      newFriend: !friendUidList.includes(friendData.uid),
    };

    if (roomMembers[0] === roomMembers[1]) {
      throw new Error('invalid room url');
    }
    if (!isRoomValid) {
      throw new Error('invalid room url');
    }
    return roomFriendData;
  });
};

const getFriendData = async (uid) => {
  const friend = db.collection('users').doc(uid);
  const friendData = await friend.get();
  return friendData.data();
};

const createRoom = async (roomid, roomMembers, profile, friends) => {
  const currentRoom = db.collection('rooms').doc(roomid);
  const doc = await currentRoom.get();

  console.warn('Valid Rom');
  if (!doc.exists) {
    db.collection('rooms').doc(roomid).set({
      members: roomMembers,
      isgroup: false,
    });
  }
};

export const addFriend = (profileUid, friendUid) => {
  db.collection('users')
    .doc(profileUid)
    .update({
      friends: firebase.firestore.FieldValue.arrayUnion(friendUid),
    });
};

export const sendMessage = (roomid, profile, message) => {
  db.collection('rooms').doc(roomid).collection('messages').add({
    uid: profile.uid,
    name: profile.displayname,
    message: message,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  });

  updateRoomLastMessage(roomid);
};

const updateRoomLastMessage = (roomid) => {
  db.collection('rooms').doc(roomid).set(
    {
      lastMessage: firebase.firestore.FieldValue.serverTimestamp(),
    },
    {
      merge: true,
    }
  );
};

// mainChat
// create room
// const unSubscribedRoomHeader = db
//   .collection('rooms')
//   .doc(roomid)
//   .onSnapshot((snapShot) => {
//     const data = snapShot.data();
//     if (data?.isgroup === true) {
//       setRoomInfo(data);
//       // setRoomName(data.name);
//       // setRoomAvatar(data.avatar);

//       // db.collection('rooms')
//       //   .doc(roomid)
//       //   .set({
//       //     members: ['public'],
//       //   });
//     } else {
//       const members = roomid.split('_');
//       let friend = '';
//       let friendUid = [];
//       members.forEach((member) => {
//         if (member !== profile.uid) {
//           friend = member;
//         }
//       });

//       friends.forEach((friend) => {
//         friendUid.push(friend.uid);
//       });

//       // if (friend !== profile.uid) {
//       getFriend(friend).then((data) => {
//         setRoomInfo({
//           avatar: data.avatar,
//           name: data.displayname,
//           friendUid: data.uid,
//           newFriend: !friendUid.includes(data.uid),
//         });
//       });
//       // }

//       const createRoom = async () => {
//         const currentRoom = db.collection('rooms').doc(roomid);
//         const doc = await currentRoom.get();

//         if (!doc.exists) {
//           db.collection('rooms').doc(roomid).set({
//             members: members,
//             isgroup: false,
//           });
//         }
//       };

//       createRoom();
//     }
//   });

// const unSubscribedMessage = db
//   .collection('rooms')
//   .doc(roomid)
//   .collection('messages')
//   .orderBy('timestamp', 'asc')
//   .onSnapshot((snapShot) =>
//     setMessages(snapShot.docs.map((doc) => doc.data()))
//   );

// const getFriend = async (uid) => {
//   const friend = db.collection('users').doc(uid);
//   const friendData = await friend.get();
//   return friendData.data();
// };

// const addFriend = () => {
//   db.collection('users')
//     .doc(profile.uid)
//     .update({
//       friends: firebase.firestore.FieldValue.arrayUnion(roomInfo.friendUid),
//     });
// };
