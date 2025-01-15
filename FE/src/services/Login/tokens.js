import axiosInstance from "../../@common/axiosInstance";

// fcm-token 저장
export const postFCMToken = async (fcmToken) => {
  const response = await axiosInstance.post("/api/fcm-tokens", {
    fcmToken,
  });

  console.log("fcm-token 저장 완료");
  return response;
};

// fcm-token 삭제
export const deleteFCMToken = async (fcmToken) => {
  const response = await axiosInstance.delete("/api/fcm-tokens", {
    data: {
      fcmToken,
    },
  });

  console.log("fcm-token 삭제 완료");
  return response;
};