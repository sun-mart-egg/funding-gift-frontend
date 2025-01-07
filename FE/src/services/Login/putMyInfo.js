import axiosInstance from "../../@common/axiosInstance";

const putMyInfo = async (name, email, phoneNumber, birthyear, birthday, gender) => {
  const response = await axiosInstance.put("/api/consumers", {
    name,
    email,
    phoneNumber,
    birthyear,
    birthday,
    gender,
  });
  
  return response;
}

export default putMyInfo;