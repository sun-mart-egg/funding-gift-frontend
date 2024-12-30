import axiosInstace from "../../@common/axiosInstance.js"

const getCategories = async () => {
  try {
    const response = await axiosInstace.get("/api/products/categories")
    console.log("상품 카테고리 요청 성공")
    console.log(response)
    return response.data.data
  }
  catch (err) {
    console.log("상품 카테고리 요청 실패")
    throw err
  }
};

export default getCategories;