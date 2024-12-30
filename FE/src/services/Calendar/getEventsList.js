import axiosInstance from "../../@common/axiosInstance.js";

const getEventsList = async(year, month) => {
  try {
    const response = await axiosInstance.get("/api/fundings/calendar", {
      params: {
        year,
        month,
      },
    });
    return response.data.data;
  }
  catch (err) {
    console.error("친구들의 펀딩목록 불러오기 실패", err);
  };
};

export default getEventsList;