import axiosInstance from "../../@common/axiosInstance";

// 내가 만든 펀딩 목록 보기
// pageable 해야함
export const getMyFundings = async () => {
  const response = await axiosInstance.get("/api/fundings/my-fundings");
  console.log("내가 만든 펀딩 목록 호출 완료");
  console.log(response.data.data.data);
  return response.data.data.data;
};

// 내가 참여한 펀딩 목록 보기
// pageable 해야함
export const getMyAttendance = async () => {
  const response = await axiosInstance.get(
    "/api/fundings/my-attendance-fundings",
  );
  console.log("내가 참여한 펀딩 목록 호출 완료");
  console.log(response.data.data.data);
  return response.data.data.data;
};

//친구가 만든 펀딩 목록 보기
export const getFriendFunding = async (friendId) => {
  const response = await axiosInstance.get("/api/fundings/friend-fundings", {
    params: {
      "friend-consumer-id": friendId,
      page: 0,
      size: 100,
      sort: "",
    },
  });

  console.log("친구가 만든 펀딩 목록 불러오기 성공", response.data.data.data);
  return response.data.data.data;
};

//펀딩 상세 조회 api
export const getDetailFunding = async (fundingId) => {
  const response = await axiosInstance.get(`/api/fundings/detail/${fundingId}`);
  console.log("디테일 펀딩 정보 불러오기 완료", response.data.data);
  return response.data.data;
};
