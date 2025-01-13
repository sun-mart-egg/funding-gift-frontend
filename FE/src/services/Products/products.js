import axiosInstance from "../../@common/axiosInstance.js";

// 상품 목록 조회 ( 쇼핑 화면 )
export const getProducts = async ({ categoryId, keyword, page, size, sort }) => {
  const response = await axiosInstance.get("/api/products", {
    params: {
      "category-id": categoryId,
      keyword,
      page,
      size,
      sort,
    }
  })
  console.log("상품 목록 조회 성공")
  console.log(response.data.data)
  return response.data.data
};

// 상품 상세 조회
export const getProductDetail = async (productId) => {
  const response = await axiosInstance.get(`/api/products/${productId}`, {
    params: {
      "product-id": productId,
    }
  })
  console.log(`${productId}번 상품 상세정보 요청 성공`)
  console.log(response.data)
  return response.data
};

// 추천 상품 목록 조회 ( 홈 화면 )
export const getRecommendProducts = async (page, size) => {
  const response = await axiosInstance.get("/api/products/rank", {
    params: {
      page,
      size,
    },
  })
  console.log("추천상품 호출 성공");
  console.log(response.data.data);
  return response.data.data
};

// 상품 카테고리 목록 조회
export const getCategories = async () => {
  const response = await axiosInstance.get("/api/products/categories")
  console.log("상품 카테고리 요청 성공")
  console.log(response)
  return response.data.data
};