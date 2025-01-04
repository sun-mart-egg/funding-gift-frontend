import axiosInstance from "../../@common/axiosInstance";

const getWishlists = async (page, size) => {
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

export default getWishlists;