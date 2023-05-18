import axios from "axios";
axios.defaults.withCredentials = true;

// 서버 주소
const api = axios.create({
  // baseURL: "http://localhost:8080/api/v1", // local 1
  baseURL: "https://k8a603.p.ssafy.io/api/v1",
});

export const UserAPI = {
  //google login
  googleLogin: (token: string) =>
    api.get(`/accounts/login`, {
      headers: {
        Authorization: `${token}`,
      },
    }),

  // google logout
  googleLogout: (token: string) =>
    api.put(
      `/accounts/signout`,
      {},
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    ),
  // google delete user info
  googleWithdraw: (accessToken: string) =>
    api.patch(
      `/accounts/withdraw`,
      {},
      {
        headers: {
          Authorization: `${accessToken}`,
        },
      }
    ),
  // get user email
  getUserEmail: (userId: string) => api.get(`/accounts/search?=${userId}`),

  //get user info with jwt, userkey
  getUserInfo: (accessToken: string, singleId: string) =>
    api.get(`/accounts/info/${singleId}`, {
      headers: {
        Authorization: `${accessToken}`,
      },
    }),
};

export const ProfileAPI = {
  // get user setting info
  getUserSetting: (accessToken: string) =>
    api.get(`/profile/setting`, {
      headers: {
        Authorization: `${accessToken}`,
      },
    }),

  // update user setting info
  updateUserSetting: (accessToken: string, voiceSetting: number) =>
    api.put(
      `/profile/setting/update`,
      {
        fontSize: 1, // 글자 크기: int (1: 작음, 2: 보통(기본값), 3: 큼)
        voiceSetting: voiceSetting, // 목소리 설정: int (1: 여성(기본값), 2: 남성)
      },
      {
        headers: {
          Authorization: `${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    ),

  // get user fav comment list
  getMyPhraseList: (accessToken: string) =>
    api.get(`/profile/frequent`, {
      headers: {
        Authorization: `${accessToken}`,
      },
    }),
  // add to user fav comment list
  addMyPhrase: (accessToken: string, sentence: string) => {
    api.post(
      `profile/frequent`,
      {
        sentence: sentence,
      },
      {
        headers: {
          Authorization: `${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
  },

  // update user fav comment
  updateMyPhrase: (
    accessToken: string,
    sentence: string,
    frequentSeq: number
  ) => {
    api.put(
      `/profile/frequent/${frequentSeq}`,
      {
        sentence: sentence,
      },
      {
        headers: {
          Authorization: `${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
  },

  // delete user fav comment
  deleteMyPhrase: (accessToken: string, frequentSeq: number) => {
    api.put(
      `/profile/frequent/${frequentSeq}/delete`,
      {},
      {
        headers: {
          Authorization: `${accessToken}`,
        },
      }
    );
  },
};

export const GPTAPI = {
  // chat GPT 추천
  recommendPhrase: (text: string) =>
    api.post(
      `/run/generate`,
      { text: text },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    ),
};

export const MeetingAPI = {
  // start meeting
  startMeeting: (accessToken: string) =>
    api.post(
      `/conversation/room/start`,
      { roomType: "sl" },
      {
        headers: {
          Authorization: `${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    ),
  finishMeeting: (accessToken: string, roomSeq: number) =>
    api.put(
      `/conversation/room/${roomSeq}/close`,
      {},
      {
        headers: {
          Authorization: `${accessToken}`,
        },
      }
    ),
  saveMeeting: (accessToken: string, roomSeq: number, formData: FormData) =>
    api.post(`/conversation/room/${roomSeq}/save`, formData, {
      headers: {
        Authorization: `${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    }),
  recommendGPT: (content: string) =>
    api.post(
      `/tg/generate`,
      { text: content },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    ),
};

// 대화기록API
export const RecordAPI = {
  // 전체기록목록조회
  getRecords: (accessToken: string, page: number) =>
    api.get(`/record?page=${page}&size=10`, {
      headers: {
        Authorization: `${accessToken}`,
      },
    }),

  //즐겨찾는 기록목록조회
  getFavRecords: (accessToken: string, page: number) =>
    api.get(`/record/favorite?page=${page}&size=10`, {
      headers: {
        Authorization: `${accessToken}`,
      },
    }),

  // 기록조회(개별)
  getRecordItem: (accessToken: string, recordSeq: number) =>
    api.get(`/record/${recordSeq}`, {
      headers: {
        Authorization: `${accessToken}`,
      },
    }),

  // 기록제목수정
  updateRecordTitle: (accessToken: string, recordSeq: number, title: string) =>
    api.put(
      `/record/${recordSeq}`,
      {
        title: title,
      },
      {
        headers: {
          Authorization: `${accessToken}`,
        },
      }
    ),

  // 기록즐겨찾기수정
  updateFavRecord: (
    accessToken: string,
    recordSeq: number,
    isFavorite: number
  ) =>
    api.put(
      `/record/${recordSeq}/favorite`,
      {
        isFavorite: isFavorite,
      },
      {
        headers: {
          Authorization: `${accessToken}`,
        },
      }
    ),

  //선택기록삭제
  deleteRecord: (accessToken: string, deleteRecordSeqList: number[]) =>
    api.put(
      `/record/delete`,
      {
        deleteRecordSeqList: deleteRecordSeqList,
      },
      {
        headers: {
          Authorization: `${accessToken}`,
        },
      }
    ),

  //메모목록조회
  getMemoList: (accessToken: string, recordSeq: number) =>
    api.get(`/record/${recordSeq}/memo`, {
      headers: {
        Authorization: `${accessToken}`,
      },
    }),

  //메모 생성
  addMemo: (
    accessToken: string,
    recordSeq: number,
    content: string,
    timestamp: number
  ) =>
    api.post(
      `/record/${recordSeq}/memo`,
      {
        content: content,
        timestamp: timestamp,
      },
      {
        headers: {
          Authorization: `${accessToken}`,
        },
      }
    ),

  // 메모 수정
  updateMemo: (
    accessToken: string,
    recordSeq: number,
    memoSeq: number,
    content: string
  ) =>
    api.put(
      `/record/${recordSeq}/memo/${memoSeq}`,
      {
        content: content,
      },
      {
        headers: {
          Authorization: `${accessToken}`,
        },
      }
    ),

  //메모 삭제
  deleteMemo: (
    accessToken: string,
    recordSeq: number,
    deleteMemoSeqList: number[]
  ) =>
    api.put(
      `/record/${recordSeq}/memo/delete`,
      {
        deleteMemoSeqList: deleteMemoSeqList,
      },
      {
        headers: {
          Authorization: `${accessToken}`,
        },
      }
    ),
};
