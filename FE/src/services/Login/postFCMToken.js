import axiosInstance from "../../@common/axiosInstance";

const postFCMToken = async (fcmToken) => {
  const response = await axiosInstance.post("/api/fcm-tokens", {
    fcmToken,
  });

  console.log("fcm-token 저장 성공");
  return response;
};

export default postFCMToken;