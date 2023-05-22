import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducer from "./modules/user";
import meetingReducer from "./modules/meeting";
import recordReducer from "./modules/records";
import profileReducer from "./modules/profile";

// root reducer
const rootReducer = combineReducers({
  user: userReducer,
  meeting: meetingReducer,
  record: recordReducer,
  profile: profileReducer,
});

const persistConfig = {
  key: "root",
  // localStorage에 저장합니다.
  storage,
  // auth, board, studio 3개의 reducer 중에 auth reducer만 localstorage에 저장합니다.
  whitelist: ["user"],
  // blacklist -> 그것만 제외합니다
};

// store 생성, 기본 미들웨어로 redux-thunk를 추가하고 개발 환경에서 리덕스 개발자 도구(Redux DevTools Extension)를 활성화해줍니다.
const store = configureStore({ reducer: rootReducer });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
