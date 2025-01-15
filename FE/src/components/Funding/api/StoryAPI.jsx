import axios from "axios";

async function getStory(token, id) {
  try {
    const response = await axios.get(
      "https://j10d201.p.ssafy.io/api/fundings/story", // 직접적인 URL 사용
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          "consumer-id": id, // 동적으로 id 값을 할당
        },
      },
    );
    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("진행중인 펀딩 목록 불러오기 실패:", error);
    throw error;
  }
}
export { getStory };
