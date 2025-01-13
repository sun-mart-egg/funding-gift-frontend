import axiosInstance from "../../@common/axiosInstance";

// 친구 펀딩 스토리 리스트
export const getFriendsStory = async() => {
  const response = await axiosInstance.get("/api/friends/fundings-story")
  console.log("친구 펀딩 스토리 리스트 호출 완료");
  return response.data.data;
};