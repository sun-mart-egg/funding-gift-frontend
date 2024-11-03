import axiosInstance from "../../@common/axiosInstance.js";

const getProducts = async ({ categoryId, keyword, page, size, sort }) => {
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
    console.log(response.data)
    return response.data
  }
  catch (err) {
    console.log("상품 목록 조회 실패")
    throw(err)
  }
};

export default getProducts;