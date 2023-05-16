// 자주 쓰는 말, 유저 정보
import { RecordAPI } from "@/apis/api";
import { RecordListType } from "@/types/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MemoType {
  memoSeq: number;
  content: string;
  timestamp: number;
}

// 초기상태
const initialState = {
  recordList: [],
  isLast: false,
  recordData: {},
};

// middleware
// 대화기록 리스트 조회 (page)
const getRecordList = createAsyncThunk(
  "record/getRecordList",
  async (page: number, thunkAPI) => {
    const accessToken = localStorage.getItem("accessToken");
    const response = await RecordAPI.getRecords(accessToken!, page);
    if (!response) {
      throw new Error();
    }
    return response.data.data;
  }
);

// 대화기록 개별 조회
const getRecordDetail = createAsyncThunk(
  "record/getRecordDetail",
  async (recordSeq: number, thunkAPI) => {
    const accessToken = localStorage.getItem("accessToken");
    const response = await RecordAPI.getRecordItem(accessToken!, recordSeq);
    if (!response) {
      throw new Error();
    }
    return response.data.data;
  }
);

// 대화기록 삭제
const deleteRecords = createAsyncThunk(
  "record/deleteRecords",
  async (deleteRecordSeqList: number[], thunkAPI) => {
    const accessToken = localStorage.getItem("accessToken");
    const response = await RecordAPI.deleteRecord(
      accessToken!,
      deleteRecordSeqList
    );
    if (!response) {
      throw new Error();
    }
    return deleteRecordSeqList;
  }
);

// 리듀서 슬라이스
const recordSlice = createSlice({
  name: "record",
  initialState,
  reducers: {},

  //middleware
  extraReducers: (builder) => {
    builder.addCase(getRecordList.fulfilled, (state, action) => {
      state.isLast = action.payload.isLast;
      state.recordList = action.payload.recordList;
    });
    builder.addCase(getRecordDetail.fulfilled, (state, action) => {
      return {
        ...state,
        recordData: action.payload,
      };
    });
    builder.addCase(deleteRecords.fulfilled, (state, action) => {
      return {
        ...state,
        recordList: state.recordList.filter((record: RecordListType) => {
          return !action.payload.includes(record.recordSeq);
        }),
      };
    });
  },
});

// 리듀서 & 액션 리턴
export const recordAction = recordSlice.actions;
export default recordSlice.reducer;

export { getRecordDetail, getRecordList, deleteRecords };
