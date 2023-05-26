import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./configStore";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// 서버로부터 유저의 로그인 여부를 받아오는 과정을 수행하는 커스텀훅
export const useAuthenticate = (): boolean => {
  // 여기서 React-Query를 이용해 서버로부터 data fetching 수행
  const isUserLoggedIn = false;

  return isUserLoggedIn;
};
