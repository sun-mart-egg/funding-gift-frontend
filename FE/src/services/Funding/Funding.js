import axiosInstance from "../../@common/axiosInstance";

//펀딩 피드 불러오기
export const getFundingFeed = async () => {
  const response = await axiosInstance.get("/api/fundings/feed", {
    page: 0,
    size: 100,
    sort: "",
  });
  console.log("펀딩 피드 불러오기 성공");
  return response.data;
};
