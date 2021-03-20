export const initialState = {
  user: null,
  inChat: false,
  profile: {
    uid: '',
    avatar: '',
    displayname: '-',
    username: 'none',
    email: '-',
    friends: ['none'],
  },
  friends: [],
};

export const actionTypes = {
  SET_USER: 'SET_USER',
  SET_INCHAT: 'SET_INCHAT',
  SET_PROFILE: 'SET_PROFILE',
  SET_FRIENDS: 'SET_FRIENDS',
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.user,
      };
    case actionTypes.SET_INCHAT:
      return {
        ...state,
        inChat: action.inChat,
      };
    case actionTypes.SET_PROFILE:
      return {
        ...state,
        profile: {
          uid: action.profile.uid,
          avatar: action.profile.avatar,
          displayname: action.profile.displayname,
          username: action.profile.username,
          email: action.profile.email,
          friends: action.profile.friends,
        },
      };
    case actionTypes.SET_FRIENDS:
      return {
        ...state,
        friends: action.friends,
      };
    default:
      return state;
  }
};

export default reducer;
