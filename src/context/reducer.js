export const initialState = {
  user: null,
  inChat: false,
};

export const actionTypes = {
  SET_USER: 'SET_USER',
  SET_INCHAT: 'SET_INCHAT',
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      window.localStorage.setItem('user', true);
      return {
        ...state,
        user: action.user,
      };
    case actionTypes.SET_INCHAT:
      return {
        ...state,
        inChat: action.inChat,
      };
    default:
      return state;
  }
};

export default reducer;
