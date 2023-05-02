// 자주 쓰는 말, 유저 정보
import { UserAPI } from "@/apis/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserType {
  isLoggedIn: boolean;
  user: {
    nickname: string;
    email: string;
    profileImg: string;
    delYn: string;
    role: string;
  };
  isLoading: boolean;
}

interface LoginPayloadType {
  nickname: string;
  email: string;
  profileImg: string;
  delYn: string;
  role: string;
}

interface UserDataType {
  accessToken: string;
  singleId: string;
}

const initialState: UserType = {
  user: {
    nickname: "",
    email: "",
    profileImg: "",
    delYn: "",
    role: "",
  },
  isLoggedIn: false,
  isLoading: false,
};

// middleware
const googleLogin = createAsyncThunk(
  "users/googleLogin",
  async (accessToken: string, thunkAPI) => {
    console.log("redux", accessToken);
    const response = await UserAPI.googleLogin(accessToken);
    if (!response) {
      throw new Error();
    }
    return response.data;
  }
);

const googleLogout = createAsyncThunk(
  "user/googleLogout",
  async (JWT: string, thunkAPI) => {
    const response = await UserAPI.googleLogout(JWT);
    if (!response) {
      throw new Error();
    }
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
    return response;
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
      state.user = {
        nickname: "",
        email: "",
        profileImg: "",
        delYn: "",
        role: "",
      };
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
        state.user = action.payload; // TODO: payload 데이터를 그대로 user에 넣어도 되는지 체크!
        localStorage.setItem("accessToken", action.payload.accessToken);
      })
      .addCase(googleLogin.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

// 리듀서 & 액션 리턴
export const userActions = userSlice.actions;
export default userSlice.reducer;

export { googleLogin, googleLogout, googleWithdraw, getUserEmail, getUserInfo };
