export const initialState = {
  user: null,
};

export const actionTypes = {
  SET_USER: 'SET_USER',
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      window.localStorage.setItem('user', true);
      return {
        ...state,
        user: action.user,
      };
    default:
      return state;
  }
};

export default reducer;
