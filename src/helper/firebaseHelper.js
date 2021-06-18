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
  // let isRoomValid = false;

  // check if member from room id is not self, its your friend
  roomMembers.forEach((member) => {
    member !== profile.uid ? (roomFriendUid = member) : (roomMeUid = member);
  });

  // get all friendlist uid
  friends.forEach((friend) => {
    friendUidList.push(friend.uid);
    // if (friend.uid === roomFriendUid) {
    //   isRoomValid = true;
    // }
  });

  // if (roomMeUid !== profile.uid) {
  //   isRoomValid = false;
  // }
  return validationUrlRoom(
    profile,
    friendUidList,
    roomid,
    roomMeUid,
    roomFriendUid
  )
    .then((roomId) => {
      createRoom(roomId, roomMembers, profile, friends);
      return getFriendData(roomFriendUid).then((friendData) => {
        const roomFriendData = {
          avatar: friendData.avatar,
          name: friendData.displayname,
          uid: friendData.uid,
          newFriend: !friendUidList.includes(friendData.uid),
        };
        return roomFriendData;
      });
    })
    .catch((error) => {
      console.error(error);
    });
};

const validationUrlRoom = async (
  profile,
  friendUidList,
  roomid,
  myUid,
  friendUid
) => {
  // myuid !== frienduid
  if (myUid !== friendUid) {
    // myUid === profile.uid
    if (myUid === profile.uid) {
      // friendUid in friendlistUid
      if (friendUidList.includes(friendUid)) {
        // check is room already?
        const room = await getRoomById(roomid);
        const roomData = await room.get();
        if (roomData.exists) {
          console.warn('its a valid room url :', roomData.exists);
          return roomid;
        }

        const splitRoomId = roomid.split('_');
        const roomFlip = await getRoomById(
          `${splitRoomId[1]}_${splitRoomId[0]}`
        );

        const roomDataFlip = await roomFlip.get();
        if (roomDataFlip.exists) {
          console.warn(
            'oh no its not valid, and we can Flip it :',
            roomData.exists
          );
          return `${splitRoomId[1]}_${splitRoomId[0]}`;
        }
        throw new Error('invalid room url : roomNot Exist');
      }
      throw new Error('invalid room url : its not friend');
    }
    throw new Error('invalid room url : its not you room');
  }
  throw new Error('invalid room url : you chat with you');
};

const getFriendData = async (uid) => {
  const friend = db.collection('users').doc(uid);
  const friendData = await friend.get();
  return friendData.data();
};

const createRoom = async (roomid, roomMembers) => {
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
