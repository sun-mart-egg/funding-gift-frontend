import axiosInstance from "../../@common/axiosInstance.js";

// 내 친구 목록 조회 (소비자)
export const getFriendsList = async() => {
  const response = await axiosInstance.get("/api/friends");
  console.log("친구목록 호출 완료")
  return response.data.data;
};

// 내 카카오 친구목록 불러오기
export const getKAKAO = async() => {
  await axiosInstance.get("/api/friends/kakao");
  console.log("카톡 친구목록 동기화 완료");
};

// 친한친구 설정 변경
export const putFavorite = async(consumerId) => {
  await axiosInstance.put(`/api/friends/${consumerId}/toggle-favorite`);
  console.log("친한친구 수정 완료");
};

// 내 친구 모두 삭제
export const deleteFriendsList = async(consumerId) => {
  await axiosInstance.delete(`/api/friends/${consumerId}`, {
    params: {
      "consumer-id": consumerId
    },
  })
  console.log("내 친구 모두 삭제 완료")
};