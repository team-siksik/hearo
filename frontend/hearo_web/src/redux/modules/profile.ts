// 자주 쓰는 말
import { ProfileAPI } from "@/apis/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FrequentType } from "@/types/types";
import { FrequentPage } from "@/pages";

// ProfileAPI 초기상태
interface ProfileType {
  isLoggedIn: boolean;
  user: {
    accessToken: string;
  };
  setting: {
    settingSeq: number;
    userSeq: number;
    fontSize: number;
    voiceSetting: number;
  };
  FrequentList: FrequentType[];
}

const initialState: ProfileType = {
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
};

// get user Setting
const getUserSetting = createAsyncThunk(
  "profile/getUserSetting",
  async (thunkAPI) => {
    const accessToken = localStorage.getItem("accessToken");
    const response = await ProfileAPI.getUserSetting(accessToken!);
    if (!response) {
      throw new Error();
    }
    return response.data.data;
  }
);

const updateUserSetting = createAsyncThunk(
  "profile/updateUserSetting",
  async (voiceSetting: number, thunkAPI) => {
    const accessToken = localStorage.getItem("accessToken");
    const response = await ProfileAPI.updateUserSetting(
      accessToken!,
      voiceSetting
    );
    if (!response) {
      throw new Error();
    }
    return { voiceSetting };
  }
);

// get user Frequent
const getFrequent = createAsyncThunk(
  "profile/getFrequent",
  async (thunkAPI) => {
    const accessToken = localStorage.getItem("accessToken");
    const response = await ProfileAPI.getMyPhraseList(accessToken!);
    if (!response) {
      throw new Error();
    }
    return response.data.data;
  }
);

const addFrequent = createAsyncThunk(
  "profile/addFrequent",
  async (sentence: string, thunkAPI) => {
    console.log(sentence);
    const accessToken = localStorage.getItem("accessToken");
    const response = await ProfileAPI.addMyPhrase(accessToken!, sentence);
    if (!response) {
      throw new Error();
    }
    return { sentence };
  }
);

// delete user Frequent
const deleteFrequent = createAsyncThunk(
  "profile/deleteFrequent",
  async (frequentSeq: number, thunkAPI) => {
    const accessToken = localStorage.getItem("accessToken");
    const response = await ProfileAPI.deleteMyPhrase(accessToken!, frequentSeq);
    if (!response) {
      throw new Error();
    }
    return { frequentSeq };
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
      state.setting = action.payload;
    });
    builder.addCase(updateUserSetting.fulfilled, (state, action) => {
      return {
        ...state,
        setting: {
          ...state.setting,
          voiceSetting: action.payload.voiceSetting,
        },
      };
    });
    builder.addCase(getFrequent.fulfilled, (state, action) => {
      return {
        ...state,
        FrequentList: action.payload,
      };
    });
    builder.addCase(deleteFrequent.fulfilled, (state, action) => {
      const newFrequentList = state.FrequentList.filter(
        (frequent: FrequentType) => {
          return frequent.frequentSeq !== action.payload.frequentSeq;
        }
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

export {
  getUserSetting,
  getFrequent,
  deleteFrequent,
  updateUserSetting,
  addFrequent,
};
