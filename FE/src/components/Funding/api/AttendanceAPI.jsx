import axios from "axios";

//펀딩 참여하기 api
async function createAttendance(
  token,
  fundingId,
  sendMessage,
  sendMessageTitle,
  price,
) {
  const requestBody = {
    sendMessageTitle: sendMessageTitle,
    sendMessage: sendMessage,
    price: price,
    fundingId: fundingId,
  };

  console.log("body", requestBody);

  try {
    const response = await fetch(
      import.meta.env.VITE_BASE_URL + "/api/attendance",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("펀딩 참여 생성 중 오류 발생:", error);
  }
}

//내가 참여한 펀딩 api
async function getMyAttendance(token, setData) {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/fundings/my-attendance-fundings`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log("내가 참여한 펀딩 정보 응답 : " + response.data.data.data);
    setData(response.data.data.data);
  } catch (error) {
    console.error("내가 참여한 펀딩 정보 불러오기 에러", error);
  }
}

//펀딩 참여 디테일 api
async function getAttendanceDetail(token, fundingId, attendanceId, setData) {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/attendance/detail`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          "attendance-id": attendanceId, // 수정된 부분
          "funding-id": fundingId,
        },
      },
    );
    console.log("내 펀딩 참여 디테일 응답 : " + response.data.data);
    setData(response.data.data);
  } catch (error) {
    console.log("에러", error);
  }
}
export { createAttendance, getMyAttendance, getAttendanceDetail };
