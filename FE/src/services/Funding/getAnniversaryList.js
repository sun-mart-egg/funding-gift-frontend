import axiosInstance from "../../@common/axiosInstance.js";

const getAnniversaryList = async (token, setData) => {
  try {
    // 만약 interceptors에서 토큰을 자동으로 셋팅한다면 아래 headers는 불필요합니다.
    // interceptors를 사용하지 않거나 별도의 토큰이 필요하다면 추가:
    const response = await axiosInstance.get("/api/anniversary-category", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("기념일 카테고리 정보: ", response.data);

    // 기존 코드처럼 setData 호출
    setData(response.data.data);
  } catch (error) {
    console.error("기념일 카테고리 리스트 불러오기 실패", error);
  }
};

export { getAnniversaryList };
