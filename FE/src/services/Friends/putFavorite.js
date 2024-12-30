import axiosInstance from "../../@common/axiosInstance.js";

const putFavorite = async(consumerId) => {
  try {
    await axiosInstance.put(`/api/friends/${consumerId}/toggle-favorite`);
    console.log("친한친구 수정");
  }
  catch (err) {
    console.error("친한친구 설정 실패", err);
    throw err;
  }
};

export default putFavorite;