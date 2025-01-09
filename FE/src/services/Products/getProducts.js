import axiosInstance from "../../@common/axiosInstance.js";

const getProducts = async ({ categoryId, keyword, page, size, sort }) => {
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

export default getProducts;