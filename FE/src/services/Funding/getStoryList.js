import axiosInstance from "../../@common/axiosInstance";

export const getStoryList = async () => {
  const response = await axiosInstance.get("/api/friends/fundings-story");
  console.log("스토리 리스트 조회 성공");
  console.log(response.data);
  return response.data;
};
