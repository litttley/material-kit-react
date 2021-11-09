import { combineReducers } from 'redux';
import displayFilter from './display';

const defaultState = { isDisplay: true };
export default (state = defaultState, action) => {
  console.log('reducer');
  console.log(state, action);
  switch (action.type) {
    case 'SHOW':
      return { ...state, isDisplay: action.text };
    case 'HIDDEN':
      return { ...state, isDisplay: action.text };
    default:
      return { ...state };
  }
};
