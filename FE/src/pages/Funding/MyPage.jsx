import { useState } from "react";
import { IoLogOut } from "react-icons/io5";
import { AiFillCamera } from "react-icons/ai";
import { useNavigate } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getConsumers,
  getInprogressFunding,
  postConsumerLogout,
  putConsumers,
} from "../../services/Consumer/consumers";
import { getAddressList, putAddress } from "../../services/Address/addresses";
import { deleteFCMToken } from "../../services/Login/tokens";
import { getCookie, removeAllCookie } from "../../@common/cookies";

function MyPage() {
  const queryClient = useQueryClient();
  const myFCMToken = getCookie("fcm-token");
  const navigate = useNavigate();
  // 소비자 정보 수정 상태 ON / OFF
  const [isEditMode, setIsEditMode] = useState(false);

  // 소비자 정보 쿼리
  const { data: userInfo = [] } = useQuery({
    queryKey: ["소비자 정보"],
    queryFn: getConsumers,
    onError: (err) => {
      console.error("소비자 정보 요청 실패", err);
    },
  });

  // 소비자 주소 정보 목록 호출 쿼리
  const { data: addressInfo = [], isLoading } = useQuery({
    queryKey: ["소비자 주소 정보"],
    queryFn: getAddressList,
    onError: (err) => {
      console.error("주소 정보 요청 실패", err);
    },
  });

  // 기본 주소지
  const defaultAddress = addressInfo.find((address) => address.isDefault === true);

  // 소비자 정보 수정
  const [editName, setEditName] = useState(userInfo.name);
  const [editAddr, setEditAddr] = useState(defaultAddress?.id);

  // 진행 중 펀딩 확인 쿼리
  const { data: isInprogress } = useQuery({
    queryKey: ["진행 중 펀딩"],
    queryFn: getInprogressFunding,
    onError: (err) => {
      console.error("진행 중 펀딩 확인 실패", err);
    },
  });

  // 로그아웃 요청 mutate
  const logOutMutate = useMutation({
    mutationFn: postConsumerLogout,
    onSuccess: () => {
      console.log("로그아웃 되었습니다.");
      window.alert("로그아웃!");
    },
    onError: (err) => {
      console.error("로그아웃 실패", err);
    },
  });

  // fcm-token 삭제 요청 mutate
  const deleteTokenMutate = useMutation({
    mutationFn: () => deleteFCMToken(myFCMToken),
    onSuccess: () => {
      console.log("fcm-token 삭제 완료");
    },
    onError: (err) => {
      console.error("fcm-token 삭제 실패", err);
    },
  });

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
      setEditName(userInfo.name);
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
      queryClient.invalidateQueries({ queryKey: ["소비자 주소 정보"] })
    },
    onError: (err) => {
      console.error("주소 수정 실패", err);
      setEditAddr(defaultAddress?.id);
    },
  });

  // 소비자 이름 변경
  const handleNameChange = (e) => {
    setEditName(e.target.value);
  };

  // 소비자 주소 변경
  const handleAddrChange = (e) => {
    const selectAddrId = e.target.value;
    setEditAddr(selectAddrId);
    console.log(`선택한 주소 id: ${selectAddrId}`);

    const selectAddr = addressInfo.find(address => address.id === Number(selectAddrId));
    console.log(selectAddr);
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
      const newAddr = addressInfo.find(address => address.id === Number(editAddr));
      await Promise.all([
        editConsumerInfo.mutateAsync({
          ...userInfo,
          name: editName,
        }),

        // 변경 전 주소에 대해 '주소 기본값' 해제
        defaultAddress && editConsumerAddr.mutateAsync({
          addressId: defaultAddress?.id,
          name: defaultAddress?.name,
          defaultAddr: defaultAddress?.defaultAddr,
          detailAddr: defaultAddress?.detailAddr,
          zipCode: defaultAddress?.zipCode,
          isDefault: false,
        }),

        // 새로운 주소에 대해 '주소 기본값' 설정
        editConsumerAddr.mutateAsync({
          addressId: editAddr,
          name: newAddr?.name,
          defaultAddr: newAddr?.defaultAddr,
          detailAddr: newAddr?.detailAddr,
          zipCode: newAddr?.zipCode,
          isDefault: true,
        }),
      ])
      setIsEditMode(false);
    }
  };

  // 로그아웃 요청
  // 로그아웃 요청 -> fcm-token 삭제 요청 -> 쿠키에서 토큰 정보 삭제 -> 메인으로 이동
  const handleLogOut = async () => {
    await Promise.all([
      logOutMutate.mutateAsync(),
      deleteTokenMutate.mutateAsync(myFCMToken),
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
    <div className="sub-layer font-cusFont3">
      {isEditMode ? (
        // 수정 모드 활성화 시 보여줄 UI
        <>
          <div className="head absolute top-20 flex w-full items-center px-6">
            <div className="relative mr-4 ">
              <img
                src={userInfo.profileImageUrl}
                alt=""
                className=" h-[80px] w-[80px] rounded-full"
              />
              {/* 절대 위치를 사용한 카메라 아이콘 */}
              <AiFillCamera
                className="absolute bottom-0 right-1 text-[20px] text-[#9B9B9B]"
                style={{ bottom: "-10px", right: "1px" }}
              />
            </div>
            <div className="flex w-[70%] justify-between">
              <input
                type="text"
                value={editName || ""}
                onChange={handleNameChange}
                placeholder={userInfo.name}
                className="mr-1 w-full rounded-md border border-gray-400 px-2 font-cusFont5 text-[25px]"
              />
            </div>
          </div>
          <div className="content absolute top-52 w-full px-6 font-cusFont3">
            <div className="birthday">
              <div className="sub-title">
                <p>생일</p>
                <button className="w-[25%] rounded-md bg-[#9B9B9B] text-[12px] text-white">
                  생일 선택
                </button>
              </div>
              <div className="sub-content">
                <p className="mr-1 w-full rounded-md border border-gray-400 p-3 px-2 font-cusFont3 text-[14px]">
                  {userInfo.birthyear}-{String(userInfo.birthday).slice(0, 2)}-
                  {String(userInfo.birthday).slice(2)}
                </p>
              </div>
            </div>
            <div className="address">
              <div className="sub-title pt-6 ">
                <p>기본 주소</p>
                <button className="w-[25%] rounded-md bg-[#9B9B9B] text-[12px] text-white">
                  기본 주소 선택
                </button>
              </div>
              <select className="mr-1 w-full rounded-md border border-gray-400 p-3 px-2 font-cusFont3 text-[14px]" onChange={handleAddrChange}>
                {addressInfo.map((address) => (
                  <option value={address.id} key={address.id}>
                    {address.defaultAddr} {address.detailAddr} /{" "}
                    {address.zipCode}
                  </option>
                ))}
              </select>
            </div>
            <div className="account">
              <div className="sub-title pt-6">
                <p>기본 계좌</p>
                <button className="w-[25%] rounded-md bg-[#9B9B9B] text-[12px] text-white">
                  기본 계좌 선택
                </button>
              </div>
              <p className="mr-1 w-full rounded-md border border-gray-400 p-3 px-2 font-cusFont3 text-[14px]">
                ⚠ 계좌정보를 추가해야 합니다. ⚠
              </p>
            </div>
          </div>
          <button
            className="absolute bottom-16 right-[15%] pb-3 text-[12px] text-gray-300"
            onClick={checkMyFunding}
          >
            회원 탈퇴
          </button>
          <div
            id="buttonSection"
            className="absolute bottom-0 flex w-full flex-row items-center justify-around p-5 gap-2"
          >
            <button
              onClick={handleEditClick}
              style={{ width: "calc(75% )" }} // 버튼 너비 조정
              className="common-btn"
            >
              수정 완료
            </button>
            <button
              onClick={() => setIsEditMode(false)}
              style={{ width: "calc(75% )" }} // 버튼 너비 조정
              className="common-btn"
            >
              취소
            </button>
          </div>
        </>
      ) : (
        // 수정 모드 비활성화
        <>
          <div className="head absolute top-20 flex w-full items-center px-6">
            <img
              src={userInfo.profileImageUrl}
              alt=""
              className=" mr-4 h-[80px] w-[80px] rounded-full"
            />
            <div className="flex w-[70%] justify-between ">
              <p className="mr-1 px-2 font-cusFont5 text-[25px]">
                {userInfo.name}
              </p>
              <button
                className="flex flex-col items-center justify-center"
                onClick={handleLogOut}
              >
                <IoLogOut className="text-[25px]" />
                <p className="text-[10px]">로그아웃</p>
              </button>
            </div>
          </div>

          <div className="content absolute top-52 w-full px-6">
            <div className="birthday">
              <div className="sub-title">
                <p>생일</p>
              </div>
              <p className="mr-1 w-full rounded-md bg-[#EFEFEF] p-3 px-2 font-cusFont3 text-[14px]">
                {userInfo.birthyear}-{String(userInfo.birthday).slice(0, 2)}-
                {String(userInfo.birthday).slice(2)}
              </p>
            </div>
            <div className="address pt-6">
              <div className="sub-title">
                <p>기본 주소</p>
              </div>
              <p className="mr-1 w-full rounded-md bg-[#EFEFEF] p-3 px-2 font-cusFont3 text-[14px]">
                {isLoading
                  ? "로딩 중..."
                  : defaultAddress
                    ? `${defaultAddress.defaultAddr} ${defaultAddress.detailAddr} / ${defaultAddress.zipCode}`
                    : "설정된 기본주소가 없습니다."}
              </p>
            </div>
            <div className="account pt-6">
              <div className="sub-title">
                <p>기본 계좌</p>
              </div>

              <p className="mr-1 w-full rounded-md  bg-[#EFEFEF]  p-3 px-2 font-cusFont3 text-[14px] ">
                ⚠ 계좌정보를 추가해야 합니다. ⚠
              </p>
            </div>
          </div>
          <div
            id="buttonSection"
            className="absolute bottom-0 flex w-full flex-col items-center justify-around pb-5"
          >
            <button
              onClick={handleEditClick}
              style={{ width: "calc(75% )" }} // 버튼 너비 조정
              className="common-btn"
            >
              수정 하기
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default MyPage;
