import axiosInstance from "../../@common/axiosInstance.js";

const getFriendsList = async() => {
  const response = await axiosInstance.get("/api/friends");
  console.log("REDIS에 친구목록 요청 완료")
  return response.data.data;
};

export default getFriendsList;