import axiosInstance from "../../@common/axiosInstance.js";

const getProductDetail = async (productId) => {
  const response = await axiosInstance.get(`/api/products/${productId}`, {
    params: {
      "product-id": productId,
    }
  })
  console.log(`${productId}번 상품 상세정보 요청 성공`)
  console.log(response.data)
  return response.data
};

export default getProductDetail;