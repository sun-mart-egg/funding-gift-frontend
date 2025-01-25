import { useState } from "react";
import { useNavigate } from "react-router";

import { useConsumer } from "../../hooks/Consumer/useConsumer";

import { getCookie, removeAllCookie } from "../../@common/cookies";
import ConsumerInfo from "../../components/Consumer/ConsumerInfo";

function MyPage() {
  const myFCMToken = getCookie("fcm-token");
  const navigate = useNavigate();
  // 소비자 정보 수정 상태 ON / OFF
  const [isEditMode, setIsEditMode] = useState(false);

  // 소비자 관련 커스텀 훅
  const {
    useConsumerInfo,
    useConsumerAddrInfo,
    useConsumerisProgress,
    useConsumerLogout,
    useConsumerDeleteToken,
    useConsumerEditAddr,
    useConsumerEditInfo,
  } = useConsumer();

  const { data: userInfo = [] } = useConsumerInfo;
  const { data: addressInfo = [] } = useConsumerAddrInfo;
  const { data: isInprogress } = useConsumerisProgress;

  // 기본 주소지
  const defaultAddress = addressInfo.find(
    (address) => address.isDefault === true,
  );

  // 기본 주소지 기준으로 select 정렬
  const sortConsumerAddr = [...addressInfo].sort((a, b) => {
    return b.isDefault - a.isDefault;
  });

  // 소비자 정보 수정을 위한 상태변수
  const [editName, setEditName] = useState(userInfo.name);
  const [editAddr, setEditAddr] = useState(defaultAddress?.id);

  // 소비자 프로필 및 주소 정보 수정 커스텀 훅
  const editDeleteToken = useConsumerDeleteToken(myFCMToken);
  const editConsumerInfo = useConsumerEditInfo(setEditName);
  const editConsumerAddr = useConsumerEditAddr(setEditAddr, defaultAddress);

  // 소비자 이름 변경
  const handleNameChange = (e) => {
    setEditName(e.target.value);
  };

  // 소비자 주소 변경
  const handleAddrChange = (e) => {
    const selectAddrId = e.target.value;
    setEditAddr(selectAddrId);
    console.log(`선택한 주소 id: ${selectAddrId}`);

    const selectAddr = addressInfo.find(
      (address) => address.id === Number(selectAddrId),
    );
    console.log(
      `선택한 주소 정보: ${selectAddr.defaultAddr} ${selectAddr.detailAddr} / ${selectAddr.zipCode}`,
    );
  };

  // 수정 버튼 클릭 시 호출될 함수
  const handleEditClick = async () => {
    // 수정모드 비활성화 상태 시
    // 수정모드 활성화 상태로 변경
    if (isEditMode === false) {
      setIsEditMode(true);
    }

    // 수정모드 활성화 상태 시
    // 소비자 정보 수정 요청
    else {
      const newAddr = addressInfo.find(
        (address) => address.id === Number(editAddr),
      );
      await Promise.all([
        editConsumerInfo.mutateAsync({
          ...userInfo,
          name: editName,
        }),

        // 기본 주소값이 있다면
        // 변경 전 기본 주소에 대해 '주소 기본값' 해제
        defaultAddress &&
          editConsumerAddr.mutateAsync({
            addressId: defaultAddress.id,
            name: defaultAddress.name,
            defaultAddr: defaultAddress.defaultAddr,
            detailAddr: defaultAddress.detailAddr,
            zipCode: defaultAddress.zipCode,
            isDefault: false,
          }),

        // 새로운 주소에 대해 '주소 기본값' 설정
        editConsumerAddr.mutateAsync({
          addressId: editAddr,
          name: newAddr.name,
          defaultAddr: newAddr.defaultAddr,
          detailAddr: newAddr.detailAddr,
          zipCode: newAddr.zipCode,
          isDefault: true,
        }),
      ]);
      setIsEditMode(false);
    }
  };

  // 로그아웃 요청
  // 로그아웃 요청 -> fcm-token 삭제 요청 -> 쿠키에서 토큰 정보 삭제 -> 메인으로 이동
  const handleLogOut = async () => {
    await Promise.all([
      useConsumerLogout.mutateAsync(),
      editDeleteToken.mutateAsync(myFCMToken),
    ]);
    removeAllCookie();
    navigate("/");
  };

  // 진행중인 펀딩이 있는지 확인하고
  // 펀딩이 있는 경우 회원탈퇴 불가능
  const checkMyFunding = () => {
    if (isInprogress === true) {
      window.alert("진행 중 펀딩이 있습니다");
    } else {
      signOut();
    }
  };

  // 회원탈퇴 관련
  // 쿠키에서 토큰 정보 삭제 -> 회원탈퇴 요청 -> 메인으로 이동
  const BYE_BYE_URL = import.meta.env.VITE_KAKAO_SIGN_OUT;
  const signOut = () => {
    removeAllCookie();
    window.location.replace(BYE_BYE_URL);
    console.log("카카오측과의 연결을 끊었습니다.");
    navigate("/");
  };

  return (
    <ConsumerInfo
      isEditMode={isEditMode}
      userInfo={userInfo}
      editName={editName}
      defaultAddress={defaultAddress}
      sortConsumerAddr={sortConsumerAddr}
      handleNameChange={handleNameChange}
      handleAddrChange={handleAddrChange}
      checkMyFunding={checkMyFunding}
      handleEditClick={handleEditClick}
      setIsEditMode={setIsEditMode}
      handleLogOut={handleLogOut}
    />
  );
}

export default MyPage;
