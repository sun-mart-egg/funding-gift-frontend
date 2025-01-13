import axiosInstance from "../../@common/axiosInstance";

// 위시리스트 불러오기
export const getWishlists = async (page, size) => {
  const response = await axiosInstance.get("/api/wishlists", {
    params: {
      page,
      size,
    },
  });

  console.log("위시리스트 불러오기 성공")
  console.log(response.data.data)
  return response.data.data
};

// 위시리스트에 추가하기
export const addWishlists = async (productId) => {
  const response = await axiosInstance.post("/api/wishlists", {
    productId
  });
  console.log("위시리스트 추가 성공", response);
}

// 위시리스트에서 삭제하기
export const deleteWishlists = async (productId) => {
  const response = await axiosInstance.delete("/api/wishlists", {
    data: { productId }
  });
  console.log("위시리스트에서 상품 제거", response);
};
