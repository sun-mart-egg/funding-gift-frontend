import axiosInstance from "../../@common/axiosInstance";

// return 이 모두 response로 되어있음.
// api 호출 후, 필요 시 return 수정

// 펀딩의 참여자 리스트
export const getAttendanceList = async (fundingId, page, size, sort) => {
  const response = await axiosInstance.get("/api/attendance/list", {
    params: {
      "funding-id": fundingId,
      page,
      size,
      sort,
    },
  });
  console.log(
    fundingId,
    "번 펀딩 참여자 리스트 조회 완료",
    response.data.data.data,
  );
  return response.data.data.data;
};

// 펀딩참여 정보 상세 조회
export const getAttendanceDetail = async (attendanceId, fundingId) => {
  const response = await axiosInstance.get("/api/attendance/detail", {
    params: {
      "attendance-id": attendanceId,
      "funding-id": fundingId,
    },
  });
  console.log("참여정보 상세조회 완료", response);
  return response;
};

// 펀딩 참여 생성
export const postMakeAttendance = async (title, msg, price, fundingId) => {
  const response = await axiosInstance.post("/api/attendance", {
    sendMessageTitle: title,
    sendMessage: msg,
    price,
    fundingId,
  });
  console.log("펀딩 참여 생성 완료", response);
  return response;
};

// 펀딩참여자에게 감사 메시지 작성
export const putThankyouMessage = async (fundingId, attendanceId, msg) => {
  const response = await axiosInstance.put("/api/attendance/write-message", {
    fundingId,
    attendanceId,
    receiveMessage: msg,
  });
  console.log("감사메시지 작성 완료", response);
  return response;
};
