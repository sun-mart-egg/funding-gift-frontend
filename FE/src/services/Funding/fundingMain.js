import axiosInstance from "../../@common/axiosInstance";

//펀딩 피드 불러오기
export const getFundingFeed = async () => {
  const response = await axiosInstance.get("/api/fundings/feed", {
    params: {
      page: 0,
      size: 100,
      sort: "", // sort가 필요하다면 'columnName,asc' 또는 'columnName,desc' 형식의 값을 설정하세요.
    },
  });
  console.log("펀딩 피드 불러오기 성공", response.data);
  return response.data.data.data;
};

//펀딩 스토리 리스트 불러오기
export const getStoryList = async () => {
  const response = await axiosInstance.get("/api/friends/fundings-story");
  console.log("스토리 리스트 조회 성공", response.data);
  return response.data.data;
};
