import axiosInstance from "../../@common/axiosInstance";

const deleteReviews = async (reviewId) => {
  const response = await axiosInstance.delete(`/api/reviews/${reviewId}`, {
    params: {
      "review-id": reviewId
    },
  });
  console.log("후기 삭제 성공", response);
}

export default deleteReviews;