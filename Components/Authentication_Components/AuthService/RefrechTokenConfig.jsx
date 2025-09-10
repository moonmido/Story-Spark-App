import AsyncStorage from "@react-native-async-storage/async-storage";

const refreshAccessToken = async () => {
  const refreshToken = await AsyncStorage.getItem("refreshToken");

  const response = await fetch(
    "http://192.168.100.7:8181/realms/story-spark/protocol/openid-connect/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: "spark-client",
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }).toString(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }

  const data = await response.json();

  // update tokens
  await AsyncStorage.setItem("accessToken", data.access_token);
  await AsyncStorage.setItem("refreshToken", data.refresh_token);

  return data.access_token;
};
export default refreshAccessToken