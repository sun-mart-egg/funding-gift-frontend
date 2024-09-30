import axiosInstance from "../../@common/axiosInstance";

const getFriends = async() => {
  try {
    const response = await axiosInstance.get("/api/friends");
    console.log("REDIS에 친구목록 요청 완료")
    return response.data.data;
  }
  catch (err) {
    console.log("REDIS에 친구목록 요청 실패")
    throw err;
  }
};

export default getFriends;