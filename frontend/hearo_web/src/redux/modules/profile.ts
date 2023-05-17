// 자주 쓰는 말
import { ProfileAPI } from "@/apis/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FrequentType } from "@/types/types"
 
// ProfileAPI 초기상태
interface ProfileType {
  isLoggedIn: boolean;
  user: {
    accessToken: string,
  },
  setting: {
    settingSeq: Number;
    userSeq: Number;
    fontSize: Number;
    voiceSetting: Number;
  } | null;
  FrequentList: FrequentType[],
};

const initialState: ProfileType  = {
  user: {
    accessToken: "",
  },
  setting: {
    settingSeq: 0,
    userSeq: 0,
    fontSize: 0,
    voiceSetting: 0,
  },
  isLoggedIn: false,
  FrequentList: [],
}

// get user Setting
const getUserSetting = createAsyncThunk(
  "profile/getUserSetting",
  async (accessToken: string, thunkAPI) => {
    const response = await ProfileAPI.getUserSetting(accessToken);
    if (!response) {
      throw new Error();
    }
    return response.data.data;
  }
);

// get user Frequent
const getFrequent = createAsyncThunk(
  "profile/getFrequent",
  async () => {
    const accessToken = localStorage.getItem("accessToken");
    const response = await ProfileAPI.getMyPhraseList(accessToken!);
    if (!response) {
      throw new Error();
    }
    return response.data.data;
  }
);

// FIXME: response 변경해야함
// 'void' 형식 식의 truthiness를 테스트할 수 없습니다.
// delete user Frequent 
const deleteFrequent = createAsyncThunk(
  "profile/deleteFrequent",
  async (frequentSeq: number, thunkAPI) => {
    const accessToken = localStorage.getItem("accessToken");
    const response = await ProfileAPI.deleteMyPhrase(
      accessToken!,
      frequentSeq);
    if (!response) {
      throw new Error();
    }
    return frequentSeq;
  }
);


const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    addMyPhrase: (state, action: PayloadAction<FrequentType>) => {
      state.FrequentList.push(action.payload);
    },
  },

  //middleware
  extraReducers: (builder) => {
    builder.addCase(getUserSetting.fulfilled, (state, action) => {
      state.user = action.payload;
      state.setting = action.payload.setting;
    });
    
    // FIXME: types.ts에 frequentSeq가 number형식임
    builder.addCase(deleteFrequent.fulfilled, (state, action) => {
      // const newFrequentList = state.FrequentList.filter(
      //   (frequent: FrequentType) => {
      //     return !action.payload.includes(frequent.frequentSeq);
      //   }
      // );
      const payloadArray = Array.isArray(action.payload) ? action.payload : [action.payload];
      const newFrequentList = state.FrequentList.filter(
        (frequent: FrequentType) => !payloadArray.includes(frequent.frequentSeq)
      );
      return {
        ...state,
        FrequentData: newFrequentList,
      };
    });
  },
});

export const ProfileAction = profileSlice.actions;
export default profileSlice.reducer;

export { getUserSetting, getFrequent, deleteFrequent}