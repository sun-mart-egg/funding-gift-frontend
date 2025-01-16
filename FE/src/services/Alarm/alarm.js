import axiosInstance from "../../@common/axiosInstance";

// 알람 읽음 상태 업데이트
export const putReadAlarms = async (alarmId) => {
  const response = await axiosInstance.put(`/api/consumer-alarms/${alarmId}/read`);
  console.log("알람 상태 변경", response);
};

// 내 알람 조회
export const getMyAlarms = async () => {
  const response = await axiosInstance.get("/api/consumer-alarms");
  console.log("알람 조회 완료");
  console.log(response);
  return response;
};

// 알람 생성
export const postMakeAlarms = async (consumerId, message, messageType) => {
  const response = await axiosInstance.post("/api/consumer-alarms", {
    consumerId,
    message,
    messageType,
  });
  console.log("알람 생성 완료", response);
  return response;
};

// 사용자별 알람 삭제
// 특정 사용자의 모든 알람을 삭제
export const deleteConsumerAlarms = async () => {
  const response = await axiosInstance.delete("/api/consumer-alarms");
  console.log("사용자 알람 삭제 완료", response);
  return response;
};

// 알람 삭제
// 특정 알람 삭제
export const deleteAlarms = async (consumerAlarmId) => {
  const response = await axiosInstance.delete(`/api/consumer-alarms/${consumerAlarmId}`);
  console.log("알람 삭제 완료", response);
  return response;
};