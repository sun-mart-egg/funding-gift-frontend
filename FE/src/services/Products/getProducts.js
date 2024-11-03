import axiosInstance from "../../@common/axiosInstance.js";

const getProducts = async ({ categoryId, keyword, page, size=10, sort=0 }) => {
  try {
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
    return response.data.data
  }
  catch (err) {
    console.log("상품 목록 조회 실패")
    throw(err)
  }
};

export default getProducts;