import axiosInstance from "../../@common/axiosInstance";

// 주소 목록 조회
export const getAddressList = async () => {
  const response = await axiosInstance.get("/api/addresses");
  console.log("주소 리스트 데이터 조회 성공");
  return response.data.data;
};

// 주소 추가
export const postAddress = async (name, defaultAddr, detailAddr, zipCode, isDefault) => {
  const response = await axiosInstance.post("/api/addresses", {
    name,
    defaultAddr,
    detailAddr,
    zipCode,
    isDefault,
  });
  console.log("주소 추가 완료");
  return response;
};

// 주소 수정
export const putAddress = async (addressId, name, defaultAddr, detailAddr, zipCode, isDefault) => {
  const response = await axiosInstance.put(`/api/addresses/${addressId}`,
    {
      name,
      defaultAddr,
      detailAddr,
      zipCode,
      isDefault
    });
  console.log("주소 수정 완료");
  return response;
};

// 주소 삭제
export const deleteAddress = async (addressId) => {
  const response = await axiosInstance.delete(`/api/addresses/${addressId}`, {
    params: {
      "address-id": addressId
    },
  });
  console.log("주소 삭제 완료")
  return response;
};