import axios from "axios";
axios.defaults.withCredentials = true;

// 서버 주소
const api = axios.create({
  // baseURL: 'http://~~~~~',// local 1
});
