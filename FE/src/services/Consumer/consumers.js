import axiosInstance from "../../@common/axiosInstance";

// 소비자 내 정보 조회
export const getConsumers = async () => {
  const response = await axiosInstance.get("/api/consumers");
  console.log("사옹자 정보 조회 데이터 성공 : ", response.data);
  return response.data;
};

// 소비자 내 정보 수정
export const putConsumers = async (name, email, phoneNumber, birthyear, birthday, gender) => {
  const response = await axiosInstance.put("/api/consumers", {
    name,
    email,
    phoneNumber,
    birthyear,
    birthday,
    gender,
  });
  return response;
};

// 소비자 로그아웃
export const postConsumerLogout = async () => {
  const response = await axiosInstance.post("/api/consumers/logout");
  console.log("로그아웃 완료");
  return response;
};

// 소비자 ID 조회
// return값 확인 후 필요시 수정
export const getConsumersId = async (consumerId) => {
  const response = await axiosInstance.get(`/api/consumers/${consumerId}`, {
    params: {
      "consumer-id": consumerId
    },
  });
  console.log("소비자 ID 조회 완료");
  return response;
};

// 진행 중인 펀딩 확인
export const getInprogressFunding = async () => {
  const response = await axiosInstance.get("/api/consumers/in-progress-funding");
  console.log("진행 중 펀딩 조회 완료");
  return response.data.data;
};