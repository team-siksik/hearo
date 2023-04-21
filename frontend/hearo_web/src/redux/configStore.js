import { configureStore, combineReducers } from "@reduxjs/toolkit";
// import '...' from "./modules/...";

// const rootReducer = combineReducers({ ...: ... });
// store 생성, 기본 미들웨어로 redux-thunk를 추가하고 개발 환경에서 리덕스 개발자 도구(Redux DevTools Extension)를 활성화해줍니다.
const store = configureStore({ reducer: rootReducer });

export default store;
