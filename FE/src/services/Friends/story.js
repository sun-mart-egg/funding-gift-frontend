import axiosInstance from "../../@common/axiosInstance";

// 친구 펀딩 스토리 리스트 불러오기
export const getFriendsStory = async () => {
  const response = await axiosInstance.get("/api/friends/fundings-story");
  console.log("친구 펀딩 스토리 리스트 호출 완료");
  return response.data.data;
};

//스토리 정보 불러오기
export const getStory = async (id) => {
  const response = await axiosInstance.get("api/fundings/story", {
    params: {
      "consumer-id": id,
    },
  });

  console.log("스토리 불러오기 성공", response.data);
  return response.data.data;
};
