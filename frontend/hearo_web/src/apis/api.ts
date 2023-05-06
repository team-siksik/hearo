import axios from "axios";
axios.defaults.withCredentials = true;

// 서버 주소
const api = axios.create({
  // baseURL: "http://localhost:8080/api/v1", // local 1
  baseURL: "http://k8a603.p.ssafy.io:8080/api/v1",
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
  updateUserSetting: (
    accessToken: string,
    fontSize: number,
    voiceSetting: number
  ) =>
    api.put(
      `/profile/setting/update`,
      {
        fontSize: fontSize, // 글자 크기: int (1: 작음, 2: 보통(기본값), 3: 큼)
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

export const ChatAPI = {
  // start communication
  startCommunication: (accessToken: string) =>
    api.post(
      `/conversation/room/start`,
      {},
      {
        headers: {
          Authorization: `${accessToken}`,
        },
      }
    ),
  finishCommunication: (accessToken: string, roomSeq: number) =>
    api.post(
      `/conversation/room/${roomSeq}/close`,
      {},
      {
        headers: {
          Authorization: `${accessToken}`,
        },
      }
    ),
};
