export const GOOGLE_OAUTH_REDIRECT_URI =
  "https://k8a603.p.ssafy.io/login/oauth2/code/google"; // deploy

export const GOOGLE_AUTH_URL =
  "https://accounts.google.com/o/oauth2/auth?" +
  `client_id=${import.meta.env.VITE_GOOGLE_OAUTH_ID}&` +
  `redirect_uri=${GOOGLE_OAUTH_REDIRECT_URI}&` +
  "response_type=token&" +
  "scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile";
