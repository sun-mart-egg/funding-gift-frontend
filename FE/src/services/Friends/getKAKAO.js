import axiosInstance from "../../@common/axiosInstance.js";

const getKAKAO = async() => {
  try {
    const res = axiosInstance.get("/api/friends/kakao");
    console.log("카톡 친구목록 동기화");
    return res.data.data;
  }
  catch (err) {
    console.error("카톡 친구목록 동기화 실패", err)
    throw err;
  }
};

export default getKAKAO;