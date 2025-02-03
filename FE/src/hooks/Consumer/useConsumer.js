import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getConsumers, getInprogressFunding, postConsumerLogout, putConsumers } from "../../services/Consumer/consumers";
import { getAddressList, putAddress } from "../../services/Address/addresses";
import { deleteFCMToken } from "../../services/Login/tokens";
import { getCookie } from "../../@common/cookies";

export const useConsumer = () => {
  // 1. 소비자 프로필 호출
  const useConsumerInfo = useQuery({
    queryKey: ["소비자 정보"],
    queryFn: getConsumers,
    onError: (err) => {
      console.error("소비자 정보 호출 실패", err);
    },
  });
  
  // 2. 소비자 주소 정보 호출
  const useConsumerAddrInfo = useQuery({
    queryKey: ["소비자 주소 정보"],
    queryFn: getAddressList,
    onError: (err) => {
      console.error("소비자 주소 정보 호출 실패", err);
    },
  });
  
  // 3. 현재 진행중인 펀딩여부 확인
  const useConsumerisProgress = useQuery({
    queryKey: ["진행 중 펀딩"],
    queryFn: getInprogressFunding,
    onError: (err) => {
      console.error("진행 중 펀딩 여부 확인 실패", err);
    },
  });

  // 4. 로그아웃 요청 mutate
  const useConsumerLogout = useMutation({
    mutationFn: postConsumerLogout,
    onSuccess: () => {
      window.alert("로그아웃 되었습니다.");
    },
    onError: (err) => {
      console.error("로그아웃 실패", err);
    },
  });

  // 5. fcm-token 삭제 요청 mutate
  const useConsumerDeleteToken = () => {
    const myFCMToken = getCookie("fcm-token");
    return useMutation({
      mutationFn: () => deleteFCMToken(myFCMToken),
      onSuccess: () => {
        console.log("fcm-token 삭제 완료");
      },
      onError: (err) => {
        console.error("fcm-token 삭제 실패", err);
      },
    });
  };

  // 6. 소비자 정보 수정 요청 mutate
  // 현재는 이름 변경만 요청하고 있음
  const useConsumerEditInfo = (setEditName) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ name, email, phoneNumber, birthyear, birthday, gender }) =>
        putConsumers(name, email, phoneNumber, birthyear, birthday, gender),
      onSuccess: () => {
        console.log("정보 수정 완료");
        queryClient.invalidateQueries({ queryKey: ["소비자 정보"] });
      },
      onError: (err) => {
        console.error("정보 수정 실패", err);
        window.alert(err.response.data.msg);
        setEditName((prev) => prev);
      },
    });
  };

  // 7. 소비자 주소 수정 요청 mutate
  const useConsumerEditAddr = (setEditAddr, defaultAddress) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({
        addressId,
        name,
        defaultAddr,
        detailAddr,
        zipCode,
        isDefault,
      }) =>
        putAddress(addressId, name, defaultAddr, detailAddr, zipCode, isDefault),
      onSuccess: (res) => {
        console.log("주소 수정 완료");
        console.log(res);
        queryClient.invalidateQueries({ queryKey: ["소비자 주소 정보"] });
      },
      onError: (err) => {
        console.error("주소 수정 실패", err);
        setEditAddr(defaultAddress?.id);
      },
    });
  };

  return {
    useConsumerInfo,
    useConsumerAddrInfo,
    useConsumerisProgress,
    useConsumerLogout,
    useConsumerDeleteToken,
    useConsumerEditInfo,
    useConsumerEditAddr,
  };
};