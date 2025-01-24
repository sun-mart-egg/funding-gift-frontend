import { useMutation } from "@tanstack/react-query";
import { postConsumerLogout } from "../../services/Consumer/consumers";
import { deleteFCMToken } from "../../services/Login/tokens";

const useConsumerLogout = (fcmToken) => {

  // 로그아웃 요청 mutate
  const logOutMutate = useMutation({
    mutationFn: postConsumerLogout,
    onSuccess: () => {
      window.alert("로그아웃 되었습니다.");
    },
    onError: (err) => {
      console.error("로그아웃 실패", err);
    },
  });

  // fcm-token 삭제 요청 mutate
  const deleteTokenMutate = useMutation({
    mutationFn: () => deleteFCMToken(fcmToken),
    onSuccess: () => {
      console.log("fcm-token 삭제 완료");
    },
    onError: (err) => {
      console.error("fcm-token 삭제 실패", err);
    },
  });

  return {
    logOutMutate,
    deleteTokenMutate,
  };
};

export default useConsumerLogout;