import axiosInstance from "../../@common/axiosInstance";

const getRecommendProducts = async (page, size) => {
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

export default getRecommendProducts;