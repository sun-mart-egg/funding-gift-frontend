import axiosInstance from "../../@common/axiosInstance";

// 상품 별 리뷰 목록 조회
export const getReviews = async (productId, productOptionId = null, page, size, sort) => {
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

// 리뷰 삭제
export const deleteReviews = async (reviewId) => {
  const response = await axiosInstance.delete(`/api/reviews/${reviewId}`, {
    params: {
      "review-id": reviewId
    },
  });
  console.log("후기 삭제 성공", response);
}