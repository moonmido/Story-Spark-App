import refreshAccessToken from "./RefrechTokenConfig";

const scheduleTokenRefresh = (expiresInSeconds) => {
  setTimeout(async () => {
    try {
      await refreshAccessToken();
      console.log("Token refreshed ✅");
    } catch (e) {
      console.error("Failed to auto-refresh token", e);
    }
  }, (expiresInSeconds - 30) * 1000); // جدد 30 ثانية قبل ما يطيح
};
