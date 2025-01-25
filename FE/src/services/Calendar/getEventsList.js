import axiosInstance from "../../@common/axiosInstance.js";

const getEventsList = async(year, month) => {
  const response = await axiosInstance.get("/api/fundings/calendar", {
    params: {
      year,
      month,
    },
  });
  console.log(`${year}년 ${month}월 기념일 목록`);
  console.log(response.data.data);
  return response.data.data;
};

export default getEventsList;