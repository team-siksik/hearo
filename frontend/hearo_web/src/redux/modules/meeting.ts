// 자주 쓰는 말, 유저 정보
import { MeetingAPI } from "@/apis/api";
import { MemoType } from "@/types/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../configStore";

interface MeetingType {
  roomInfo: {
    roomSeq: number;
    regDtm: string;
    endDtm: string | null;
    roomId: string;
  };
  memoList: MemoType[];
  gptRecommend: string[];
}

// 초기상태
const initialState: MeetingType = {
  roomInfo: {
    roomSeq: 0,
    regDtm: "2000.01.01 00:00:01",
    endDtm: null,
    roomId: "",
  },
  memoList: [],
  gptRecommend: [],
};

// middleware
const startMeeting = createAsyncThunk(
  "meeting/startMeeting",
  async (accessToken: string, thunkAPI) => {
    console.log(accessToken);
    const response = await MeetingAPI.startMeeting(accessToken);
    if (!response) {
      throw new Error();
    }
    return response.data.data;
  }
);

const saveMeeting = createAsyncThunk(
  "meeting/saveMeeting",
  async (audio: Blob, thunkAPI) => {
    const accessToken = sessionStorage.getItem("accessToken");
    const currentState = thunkAPI.getState() as RootState;
    const memo = new Blob(
      [
        JSON.stringify({
          memo: currentState.meeting.memoList,
        }),
      ],
      {
        type: "application/json",
      }
    );
    const formData = new FormData();
    formData.append("audio", audio);
    formData.append("memo", memo);
    console.log(audio, memo);
    const response = await MeetingAPI.saveMeeting(
      accessToken!,
      currentState.meeting.roomInfo.roomSeq,
      formData
    );
    if (!response) {
      throw new Error();
    }
    return response.data.data;
  }
);

const recommendGPT = createAsyncThunk(
  "meeting/recommendGPT",
  async (content: string, thunkAPI) => {
    const response = await MeetingAPI.recommendGPT(content);
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
  reducers: {
    addMemo: (state, action: PayloadAction<MemoType>) => {
      state.memoList.push(action.payload);
    },
    deleteMemo: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        memoList: state.memoList.splice(action.payload, 1),
      };
    },
  },

  //middleware
  extraReducers: (builder) => {
    builder.addCase(startMeeting.fulfilled, (state, action) => {
      return {
        ...state,
        roomInfo: action.payload,
      };
    });
    builder.addCase(recommendGPT.fulfilled, (state, action) => {
      return {
        ...state,
        gptRecommend: action.payload,
      };
    });
  },
});

// 리듀서 & 액션 리턴
export const meetingAction = meetingSlice.actions;
export default meetingSlice.reducer;

export { startMeeting, saveMeeting, recommendGPT };
