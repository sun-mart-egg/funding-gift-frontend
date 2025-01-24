import { useMutation, useQueryClient } from "@tanstack/react-query";
import { putConsumers } from "../../services/Consumer/consumers";
import { putAddress } from "../../services/Address/addresses";

const useEditConsumerInfo = (setEditName, setEditAddr, defaultAddress) => {
  const queryClient = useQueryClient();

  // 소비자 정보 수정 요청 mutate
  // 현재는 이름 변경만 요청하고 있음
  const editConsumerInfo = useMutation({
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

  // 소비자 주소 수정 요청 mutate
  const editConsumerAddr = useMutation({
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

  return {
    editConsumerAddr,
    editConsumerInfo,
  };
};

export default useEditConsumerInfo;