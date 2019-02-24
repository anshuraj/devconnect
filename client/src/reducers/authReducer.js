const INITIAL_STATE = {
  isAuthenticated: false,
  user: {}
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    default:
      return state;
  }
}