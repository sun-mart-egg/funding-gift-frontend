import axiosInstance from "../../@common/axiosInstance.js";

const getKAKAO = async() => {
  try {
    await axiosInstance.get("/api/friends/kakao");
    console.log("카톡 친구목록 동기화");
  }
  catch (err) {
    console.error("카톡 친구목록 동기화 실패", err)
    throw err;
  }
};

export default getKAKAO;