// 자주 쓰는 말, 유저 정보
import { UserAPI } from "@/apis/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// 초기상태
const initialState: [] = [];

// middleware

// 리듀서 슬라이스
const meetingSlice = createSlice({
  name: "meeting",
  initialState,
  reducers: {},

  //middleware
  extraReducers: (builder) => {},
});

// 리듀서 & 액션 리턴
export const meetingAction = meetingSlice.actions;
export default meetingSlice.reducer;

export {};
