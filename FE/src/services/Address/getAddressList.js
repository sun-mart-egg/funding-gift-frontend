import axiosInstance from "../../@common/axiosInstance";

const getAddressList = async (token, setData) => {
  try {
    const response = await axiosInstance.get("/api/addresses", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("주소 리스트 데이터 조회 성공 : ", response.data);
    setData(response.data.data);
  } catch (error) {
    console.error("주소 목록 정보를 불러 올 수 없습니다. ", error);
  }
};

export { getAddressList };
