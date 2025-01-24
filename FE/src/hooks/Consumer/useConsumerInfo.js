import { useQueries } from "@tanstack/react-query";
import { getConsumers, getInprogressFunding } from "../../services/Consumer/consumers";
import { getAddressList } from "../../services/Address/addresses";

const useConsumerInfo = () => {
  // 1. 소비자 프로필 호출
  // 2. 소비자 주소 정보 호출
  // 3. 현재 진행중인 펀딩 확인
  return useQueries({
    queries: [
      {
        queryKey: ["소비자 정보"],
        queryFn: getConsumers,
        onError: (err) => {
          console.error("소비자 정보 호출 실패", err);
        },
      },
      {
        queryKey: ["소비자 주소 정보"],
        queryFn: getAddressList,
        onError: (err) => {
          console.error("소비자 주소 정보 호출 실패", err);
        },
      },
      {
        queryKey: ["진행중인 펀딩"],
        queryFn: getInprogressFunding,
        onError: (err) => {
          console.error("진행중인 펀딩 확인 실패", err);
        },
      },
    ],
  });
};

export default useConsumerInfo;