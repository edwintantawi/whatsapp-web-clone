export const initialState = {
  user: null,
  inChat: false,
  profile: {
    avatar: '',
    displayname: '-',
    username: 'none',
    email: '-',
    friends: ['none'],
  },
};

export const actionTypes = {
  SET_USER: 'SET_USER',
  SET_INCHAT: 'SET_INCHAT',
  SET_PROFILE: 'SET_PROFILE',
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
          avatar: action.profile.avatar,
          displayname: action.profile.displayname,
          username: action.profile.username,
          email: action.profile.email,
          friends: action.profile.friends,
        },
      };
    default:
      return state;
  }
};

export default reducer;
