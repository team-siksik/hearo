// 자주 쓰는 말, 유저 정보
import { RecordAPI } from "@/apis/api";
import { MemoFromServerType } from "@/types/types";
import { RecordListType } from "@/types/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface newTitleData {
  newTitle: string;
  recordSeq: number;
}
interface DelItem {
  memoSeq: number[];
  recordSeq: number;
}

// 초기상태
const initialState = {
  recordList: [],
  isLast: false,
  recordData: {
    recordSeq: 0,
    conversationSeq: 0,
    title: "",
    isFavorite: 0,
    clovaFile: "", // JSON.parse 해야함
    recordedFileUrl: "",
    recordingTime: "",
    regDtm: "",
    modDtm: "",
    memoList: [],
  },
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

// 대화 기록 제목 수정
const changeRecordTitleAsync = createAsyncThunk(
  "record/changeRecordTitle",
  async (newData: newTitleData, thunkAPI) => {
    const { newTitle, recordSeq } = newData;
    const accessToken = localStorage.getItem("accessToken");
    const response = await RecordAPI.updateRecordTitle(
      accessToken!,
      recordSeq,
      newTitle
    );
    if (!response) {
      throw new Error();
    }
    return { newTitle };
  }
);

// 대화 기록 메모 삭제
const deleteMemoAsync = createAsyncThunk(
  "record/deleteMemo",
  async (delItem: DelItem, thunkAPI) => {
    const { memoSeq, recordSeq } = delItem;
    const accessToken = localStorage.getItem("accessToken");
    const response = await RecordAPI.deleteMemo(
      accessToken!,
      recordSeq,
      memoSeq
    );
    if (!response) {
      throw new Error();
    }
    return { memoSeq };
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
      const newRecordList = state.recordList.filter(
        (record: RecordListType) => {
          return !action.payload.includes(record.recordSeq);
        }
      );
      return {
        ...state,
        recordList: newRecordList,
      };
    });
    builder.addCase(changeRecordTitleAsync.fulfilled, (state, action) => {
      return {
        ...state,
        recordData: {
          ...state.recordData,
          title: action.payload.newTitle,
        },
      };
    });
    builder.addCase(deleteMemoAsync.fulfilled, (state, action) => {
      const newRecordData = state.recordData.memoList.filter(
        (memo: MemoFromServerType) => {
          return memo.memoSeq !== action.payload.memoSeq[0];
        }
      );
      return {
        ...state,
        recordData: {
          ...state.recordData,
          memoList: newRecordData,
        },
      };
    });
  },
});

// 리듀서 & 액션 리턴
export const recordAction = recordSlice.actions;
export default recordSlice.reducer;

export {
  getRecordDetail,
  getRecordList,
  deleteRecords,
  changeRecordTitleAsync,
  deleteMemoAsync,
};
