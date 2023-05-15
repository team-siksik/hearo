// 자주 쓰는 말, 유저 정보
import { MeetingAPI } from "@/apis/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MeetingType {
  roomSeq: number;
  regDtm: string;
  endDtm: string | null;
  roomId: string;
}
// 초기상태
const initialState = {
  roomSeq: 0,
  regDtm: "2000.01.01 00:00:01",
  endDtm: null,
  roomId: "",
};

// middleware
const startMeeting = createAsyncThunk(
  "meeting/startMeeting",
  async (accessToken: string, thunkAPI) => {
    const response = await MeetingAPI.startMeeting(accessToken);
    if (!response) {
      throw new Error();
    }
    return response.data.data;
  }
);

// 리듀서 슬라이스
const meetingSlice = createSlice({
  name: "meeting",
  initialState,
  reducers: {},

  //middleware
  extraReducers: (builder) => {
    builder.addCase(startMeeting.fulfilled, (state, action) => {
      state.roomSeq = action.payload.roomSeq;
      state.regDtm = action.payload.regDtm;
      state.endDtm = action.payload.endDtm;
      state.roomId = action.payload.roomId;
    });
  },
});

// 리듀서 & 액션 리턴
export const meetingAction = meetingSlice.actions;
export default meetingSlice.reducer;

export { startMeeting };
