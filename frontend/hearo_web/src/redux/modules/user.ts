import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoggedIn: false,
};

// 리듀서 슬라이스
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // loginAction(state: UserState, action: PayloadAction<LoginPayload>) {
    //   state.isLoggedIn = true;
    //   state.userData = action.payload;
    // },
    // logoutAction(state: UserState) {
    //   state.isLoggedIn = false;
    //   state.userData = null;
    // },
  },
});

// 리듀서 & 액션 리턴
const { reducer, actions } = userSlice;
// export const { loginAction, logoutAction } = actions;
export default reducer;
