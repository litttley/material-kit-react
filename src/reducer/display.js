const defaultState = { isDisplay: true };
const displayFilter = (state = defaultState, action) => {
  switch (action.type) {
    case 'SHOW':
      return state;
    default:
      return state;
  }
};

export default displayFilter;
