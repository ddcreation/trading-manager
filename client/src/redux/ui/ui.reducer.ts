import { NOTIFICATION_CLOSE, UI_NOTIFY } from './ui.types';

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
      newState.notifications = [...newState.notifications, action.payload];
      break;
    }
    case NOTIFICATION_CLOSE: {
      newState.notifications = [...newState.notifications].filter(
        (notification) => notification !== action.payload
      );
      break;
    }
  }

  return newState;
};

export default uiReducer;
