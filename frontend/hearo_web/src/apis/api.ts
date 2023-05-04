import axios from "axios";
axios.defaults.withCredentials = true;

// 서버 주소
const api = axios.create({
  baseURL: "http://localhost:8080/api/v1", // local 1
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
  googleWithdraw: (token: string) =>
    api.patch(
      `/accounts/withdraw`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
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
