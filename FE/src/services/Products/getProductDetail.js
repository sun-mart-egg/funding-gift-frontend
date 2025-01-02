import axiosInstance from "../../@common/axiosInstance.js";

const getProductDetail = async (productId) => {
  try {
    const response = await axiosInstance.get(`/api/products/${productId}`, {
      params: {
        "product-id": productId,
      }
    })
    console.log("상세정보 요청 성공")
    console.log(response.data)
    return response.data
  }
  catch (err) {
    console.error("상세정보 요청 실패", err)
    throw err
  }
};

export default getProductDetail;