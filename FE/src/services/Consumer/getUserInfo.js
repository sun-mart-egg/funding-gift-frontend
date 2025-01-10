import axiosInstance from "../../@common/axiosInstance";

const getUserInfo = async (token) => {
  try {
    const response = await axiosInstance.get("/api/consumers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("사옹자 정보 조회 데이터 성공 : ", response.data);

    return response.data;
  } catch (error) {
    console.error("사용자 정보 불러오기 실패", error);
  }
};

export { getUserInfo };
