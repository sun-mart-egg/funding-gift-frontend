import axiosInstance from "../../@common/axiosInstance";

const deleteWishlists = async (productId) => {
  const response = await axiosInstance.delete("/api/wishlists", {
    data: { productId }
  });
  console.log("위시리스트에서 상품 제거", response);
};

export default deleteWishlists;