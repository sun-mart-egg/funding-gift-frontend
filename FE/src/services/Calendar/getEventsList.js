import axiosInstance from "../../@common/axiosInstance.js";

const getEventsList = async(year, month) => {
  const response = await axiosInstance.get("/api/fundings/calendar", {
    params: {
      year,
      month,
    },
  });
  return response.data.data;
};

export default getEventsList;