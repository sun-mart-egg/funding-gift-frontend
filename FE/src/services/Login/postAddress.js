import axiosInstance from "../../@common/axiosInstance";

const postAddress = async (name, defaultAddr, detailAddr, zipCode, isDefault) => {
  const response = await axiosInstance.post("/api/addresses", {
    name,
    defaultAddr,
    detailAddr,
    zipCode,
    isDefault,
  });

  return response;
};

export default postAddress;