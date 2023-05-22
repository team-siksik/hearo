// 자주 쓰는 말, 유저 정보
import { UserAPI } from "@/apis/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserType {
  isLoggedIn: boolean;
  user: {
    nickname: string;
    userSeq: number;
    accessToken: string;
    email: string;
    profileImg: string;
    delYn: string;
    role: string;
  } | null;
  setting: {
    settingSeq: Number;
    userSeq: Number;
    fontSize: Number;
    voiceSetting: Number;
  } | null;
  isLoading: boolean;
}

interface LoginPayloadType {
  nickname: string;
  email: string;
  accessToken: string;
  profileImg: string;
  delYn: string;
  role: string;
}

interface UserDataType {
  accessToken: string;
  singleId: string;
}

// 초기상태
const initialState: UserType = {
  user: {
    nickname: "",
    userSeq: 0,
    email: "",
    accessToken: "",
    profileImg: "",
    delYn: "",
    role: "",
  },
  setting: {
    settingSeq: 0,
    userSeq: 0,
    fontSize: 0,
    voiceSetting: 0,
  },
  isLoggedIn: false,
  isLoading: false,
};

// middleware
const googleLogin = createAsyncThunk(
  "users/googleLogin",
  async (accessToken: string, thunkAPI) => {
    const response = await UserAPI.googleLogin(accessToken);
    if (!response) {
      throw new Error();
    }
    console.log(response.data.data);
    return response.data.data;
  }
);

const googleLogout = createAsyncThunk(
  "user/googleLogout",
  async (JWT: string, thunkAPI) => {
    const response = await UserAPI.googleLogout(JWT);
    if (!response) {
      throw new Error();
    }
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("userSeq");
    return response;
  }
);

const googleWithdraw = createAsyncThunk(
  "user/googleWithdraw",
  async (JWT: string, thunkAPI) => {
    const response = await UserAPI.googleWithdraw(JWT);
    if (!response) {
      throw new Error();
    }

    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("userSeq");
    return response;
  }
);
// get user info with JWT, userKey
const getUserInfo = createAsyncThunk(
  "user/getUserInfo",
  async (userData: UserDataType, thunkAPI) => {
    const { accessToken, singleId } = userData;
    const response = await UserAPI.getUserInfo(accessToken, singleId);
    if (!response) {
      throw new Error();
    }
    return response.data.data;
  }
);
// get user info with email
const getUserEmail = createAsyncThunk(
  "user/getUserEmail",
  async (userEmail: string, thunkAPI) => {
    const response = await UserAPI.googleWithdraw(userEmail);
    if (!response) {
      throw new Error();
    }
    return response;
  }
);

// 리듀서 슬라이스
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logoutAction(state: UserType) {
      state.isLoggedIn = false;
      state.user = null;
    },
  },

  //middleware
  extraReducers: (builder) => {
    builder
      // 구글 로그인
      .addCase(googleLogin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        sessionStorage.setItem("accessToken", action.payload.accessToken);
        sessionStorage.setItem("userSeq", action.payload.userSeq);
        state.user = action.payload;
        state.user!.accessToken = "";
      })
      .addCase(googleLogin.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(googleWithdraw.fulfilled, (state, action) => {
        sessionStorage.removeItem("accessToken");
        state.isLoggedIn = false;
        state.user = null;
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(getUserEmail.fulfilled, (state, action) => {
        state.user = action.payload.data;
        state.isLoggedIn = true;
      });
  },
});

// 리듀서 & 액션 리턴
export const userActions = userSlice.actions;
export default userSlice.reducer;

export { googleLogin, googleLogout, googleWithdraw, getUserEmail, getUserInfo };
