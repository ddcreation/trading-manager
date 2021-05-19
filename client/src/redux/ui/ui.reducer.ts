import { UI_NOTIFY } from './ui.types';

interface UIState {
  notifications: unknown[];
}

const initialState: UIState = {
  notifications: [],
};

const uiReducer = (state = initialState, action: any): UIState => {
  let newState = { ...state };

  switch (action.type) {
    case UI_NOTIFY: {
      newState.notifications.push(action.payload);
      break;
    }
  }

  return newState;
};

export default uiReducer;
