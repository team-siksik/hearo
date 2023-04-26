import React from "react";
// http://localhost:5173/login/oauth2/code/google#access_token=ya29.a0Ael9sCPG8mQ2CSirbWa5C8qDgmMgTkt8QE5lENe6DZyvHXSnseRhXMgeXtExPgXLmodLwvEvY89nX_E9zhzcamgKjHHbpu5l5GgMb3eglaeghMHLP4T5J3eDtZDGh3qWQi0HIZYcF8uLzFZT9XWsm3t_b6evaCgYKAQUSARISFQF4udJhjYFPqRd3beOyMdCYMZ3IOg0163&token_type=Bearer&expires_in=3599&scope=email%20profile%20https://www.googleapis.com/auth/userinfo.email%20openid%20https://www.googleapis.com/auth/userinfo.profile&authuser=1&prompt=consent
function Google() {
  const parsedHash = new URLSearchParams(window.location.hash.substring(1));
  const accessToken = parsedHash.get("access_token");
  //TODO: access Token을 백으로 넘겨줌
  return <div></div>;
}

export default Google;
