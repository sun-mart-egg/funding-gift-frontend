import axiosInstance from "../../@common/axiosInstance";

const addWishlists = async (productId) => {
  const response = await axiosInstance.post("/api/wishlists", {
    productId
  });
  console.log("위시리스트 추가 성공", response);
}

export default addWishlists;