import axiosInstance from "../../@common/axiosInstance.js";

const getAnniversaryList = async (token, setData) => {
  const response = await axiosInstance.get("/api/anniversary-category");
  console.log("기념일 카테고리 정보: ", response.data);
  setData(response.data.data);
};

export { getAnniversaryList };
