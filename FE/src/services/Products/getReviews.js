import axiosInstance from "../../@common/axiosInstance";

const getReviews = async (productId, productOptionId = null, page, size, sort) => {
  const params = {
    "product-id": productId,
    page,
    size,
    sort,
  }

  if (productOptionId !== null) {
    params["product-option-id"] = productOptionId;
  }

  const response = await axiosInstance.get("/api/reviews", {params});
  console.log(`${productId}번 상품 후기목록 호출 성공`)
  console.log(response.data.data)
  return response.data;
}

export default getReviews;