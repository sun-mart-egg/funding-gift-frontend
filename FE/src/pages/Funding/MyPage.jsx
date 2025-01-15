import { useState } from "react";
import { IoLogOut } from "react-icons/io5";
import { AiFillCamera } from "react-icons/ai";
import { useNavigate } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query"

import { getConsumers, getInprogressFunding, postConsumerLogout } from "../../services/Consumer/consumers";
import { getAddressList } from "../../services/Address/addresses";
import { deleteFCMToken } from "../../services/Login/tokens";

function MyPage() {
  const myFCMToken = localStorage.getItem("fcm-token")
  const navigate = useNavigate();
  // 소비자 정보 수정 상태 ON / OFF
  const [isEditMode, setIsEditMode] = useState(false);

  // 수정 버튼 클릭 시 호출될 함수
  const handleEditClick = () => {
    setIsEditMode(!isEditMode);
  };

  // 소비자 정보 쿼리
  const { data: userInfo = [] } = useQuery({
    queryKey: ["소비자 정보"],
    queryFn: getConsumers,
    onError: (err) => {
      console.error("소비자 정보 요청 실패", err)
    },
  });

  // 소비자 주소 정보 목록 호출 쿼리
  const { data: addressInfo = [], isLoading } = useQuery({
    queryKey: ["소비자 주소 정보"],
    queryFn: getAddressList,
    onError: (err) => {
      console.error("주소 정보 요청 실패", err)
    },
  });

  // 진행 중 펀딩 확인 쿼리
  const { data: isInprogress } = useQuery({
    queryKey: ["진행 중 펀딩"],
    queryFn: getInprogressFunding,
    onError: (err) => {
      console.error("진행 중 펀딩 확인 실패", err)
    },
  });

  // 로그아웃 요청 mutate
  const logOutMutate = useMutation({
    mutationFn: postConsumerLogout,
    onSuccess: () => {
      console.log("로그아웃 되었습니다.")
      window.alert("로그아웃!")
    },
    onError: (err) => {
      console.error("로그아웃 실패", err)
    },
  });

  // fcm-token 삭제 요청 mutate
  const deleteTokenMutate = useMutation({
    mutationFn: () => deleteFCMToken(myFCMToken),
    onSuccess: () => {
      console.log("fcm-token 삭제 완료")
    },
    onError: (err) => {
      console.error("fcm-token 삭제 실패", err)
    },
  });

  // 사용자 이름 변경 시 호출될 함수
  // 수정 필요
  const handleNameChange = () => {
    // setUserInfo({ ...userInfo, name: event.target.value });
  };

  // 로그아웃 요청
  // 로그아웃 요청 성공 -> FCM토큰 삭제 성공 -> 로컬스토리지 클리어 and 홈 화면으로 이동
  const handleLogOut = async () => {
    await Promise.all([
      logOutMutate.mutateAsync(),
      deleteTokenMutate.mutateAsync(myFCMToken),
    ])
    localStorage.clear();
    navigate("/")
  };

  // 진행중인 펀딩이 있는지 확인하고
  // 펀딩이 있는 경우 회원탈퇴 못해요 ^^
  const checkMyFunding = () => {
    if (isInprogress === true) {
      window.alert("진행 중 펀딩이 있습니다")
      console.log(isInprogress)
    } else {
      signOut()
    }
  };

  // 회원탈퇴 관련 ( 카카오과의 연결을 끊음 )
  const BYE_BYE_URL = import.meta.env.VITE_KAKAO_SIGN_OUT;

  const signOut = () => {
    localStorage.clear();
    window.location.replace(BYE_BYE_URL);
    console.log("카카오측과의 연결을 끊었습니다.");
    navigate("/")
  };

  return (
    <div className="sub-layer font-cusFont3">
      {isEditMode ? (
        // 수정 모드 활성화 시 보여줄 UI
        <>
          <div className="absolute flex items-center w-full px-6 head top-20">
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
                value={userInfo.name}
                onChange={handleNameChange}
                className="mr-1 w-full rounded-md border border-gray-400 px-2 font-cusFont5 text-[25px]"
              />
            </div>
          </div>
          <div className="absolute w-full px-6 content top-52 font-cusFont3">
            <div className="birthday">
              <div className="sub-title">
                <p>생일</p>{" "}
                <button className="w-[25%] rounded-md bg-[#9B9B9B] text-[12px] text-white">
                  생일 선택
                </button>
              </div>
              <div className="sub-content">
                <p className="mr-1 w-full rounded-md border border-gray-400 p-3 px-2 font-cusFont3 text-[14px]">
                {userInfo.birthyear}-{String(userInfo.birthday).slice(0, 2)}-{String(userInfo.birthday).slice(2)}
                </p>
              </div>
            </div>
            <div className="address">
              <div className="pt-6 sub-title ">
                <p>기본 주소</p>{" "}
                <button className="w-[25%] rounded-md bg-[#9B9B9B] text-[12px] text-white">
                  기본 주소 선택
                </button>
              </div>
              <p className="mr-1 w-full rounded-md border border-gray-400 p-3 px-2 font-cusFont3 text-[14px]">
              {addressInfo[0].defaultAddr} {addressInfo[0].detailAddr} / {addressInfo[0].zipCode}
              </p>
            </div>
            <div className="account">
              <div className="pt-6 sub-title">
                <p>기본 계좌</p>{" "}
                <button className="w-[25%] rounded-md bg-[#9B9B9B] text-[12px] text-white">
                  기본 계좌 선택
                </button>
              </div>
              <p className="mr-1 w-full rounded-md border border-gray-400 p-3 px-2 font-cusFont3 text-[14px]">
                {userInfo.accountBank} {userInfo.accountNo}
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
            className="absolute bottom-0 flex flex-col items-center justify-around w-full pb-5"
          >
            <button
              onClick={handleEditClick}
              style={{ width: "calc(75% )" }} // 버튼 너비 조정
              className="common-btn"
            >
              수정 완료
            </button>
          </div>
        </>
      ) : (
        // 수정 모드 비활성화
        <>
          <div className="absolute flex items-center w-full px-6 head top-20">
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

          <div className="absolute w-full px-6 content top-52">
            <div className="birthday">
              <div className="sub-title">
                <p>생일</p>
              </div>
              <p className="mr-1 w-full rounded-md bg-[#EFEFEF] p-3 px-2 font-cusFont3 text-[14px]">
                {userInfo.birthyear}-{String(userInfo.birthday).slice(0, 2)}-{String(userInfo.birthday).slice(2)}
              </p>
            </div>
            <div className="pt-6 address">
              <div className="sub-title">
                <p>기본 주소</p>
              </div>
              <p className="mr-1 w-full rounded-md bg-[#EFEFEF] p-3 px-2 font-cusFont3 text-[14px]">
                {isLoading ? (
                  "로딩 중..."
                ) : addressInfo.length > 0 ? (
                  `${addressInfo[0].defaultAddr} ${addressInfo[0].detailAddr} / ${addressInfo[0].zipCode}`
                ) : (
                  "주소 정보가 없습니다."
                ) }
              </p>
            </div>
            <div className="pt-6 account">
              <div className="sub-title">
                <p>기본 계좌</p>
              </div>

              <p className="mr-1 w-full rounded-md  bg-[#EFEFEF]  p-3 px-2 font-cusFont3 text-[14px] ">
                {/* {userInfo.accountBank} {userInfo.accountNo} */}
                ⚠ 계좌 정보를 추가해야 합니다. ⚠
              </p>
            </div>
          </div>
          <div
            id="buttonSection"
            className="absolute bottom-0 flex flex-col items-center justify-around w-full pb-5"
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
