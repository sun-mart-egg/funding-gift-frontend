import { BsPeopleFill } from "react-icons/bs";
import { IoMdSettings } from "react-icons/io";
import SearchBar from "../../UI/SearchBar";
import CardList from "../component/CardList";
import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

import { useQuery } from "@tanstack/react-query"
import { getConsumers } from "../../../services/Consumer/consumers";
import { getMyFundings, getMyAttendance } from "../../../services/Funding/fundings";

function MyFunding() {
  const navigate = useNavigate();
  const [buttonSelected, setButtonSelected] = useState("myFunding");

  // 소비자 정보 호출 쿼리
  const { data: userInfo = [] } = useQuery({
    queryKey: ["소비자 정보"],
    queryFn: getConsumers,
    onError: (err) => {
      console.log("소비자 정보 요청 실패")
      console.error(err)
    }
  })

  // 내가 만든 펀딩 호출 쿼리
  // 무한 스크롤 적용 예정
  const { data: myFundings = [] } = useQuery({
    queryKey: ["내 펀딩"],
    queryFn: getMyFundings,
    onError: (err) => {
      console.error(err)
    },
  });

  // 내가 참여한 펀딩 호출 쿼리
  // 무한 스크롤 적용 예정
  const { data: myAttendance = [] } = useQuery({
    queryKey: ["내가 참여한 펀딩"],
    queryFn: getMyAttendance,
    onError: (err) => {
      console.error(err)
    }
  })

  // 버튼 클릭에 따른 펀딩 목록 및 UI 변경
  const handleClickButton = (e) => {
    const buttonName = e.target.name;
    setButtonSelected(buttonName);
  };

  // 펀딩 생성 버튼
  const handleCreateFundingClick = () => {
    navigate("/make-funding-main");
  };

  return (
    <div className="main-layer ">
      {/* 내 프로필 정보 */}
      <div
        id="profileSection"
        className=" flex w-full justify-between p-2 px-6"
      >
        <div id="leftSection" className="flex items-center space-x-4">
          <img
            src={userInfo.profileImageUrl}
            alt="프로필"
            className="h-[60px] w-[60px] rounded-full  border-gray-300"
          />
          <p className="font-cusFont5 text-xl">{userInfo.name}</p>
        </div>

        <div id="rightSection" className="flex items-center space-x-0">
          <button
            id="friendButton"
            className="flex flex-col items-center space-y-1 p-2"
            onClick={() => navigate("/friends")}
          >
            <BsPeopleFill size="20" />
            <p className="text-sm">친구</p>
          </button>

          <button
            onClick={() => navigate("/my-page")}
            className="flex flex-col items-center space-y-1 p-2"
          >
            <IoMdSettings size="20" />
            <p className="text-sm">설정</p>
          </button>
        </div>
      </div>

      {/* 펀딩 목록 헤더 */}
      <div id="buttonSection" className="flex w-full justify-between  ">
        <button
          onClick={handleClickButton}
          name="myFunding"
          className={
            buttonSelected === "myFunding"
              ? ` w-3/6 bg-cusColor3 p-4 text-xs text-white `
              : `w-3/6 border-b border-t border-cusColor3 p-4 text-xs`
          }
        >
          내가 만든 펀딩 ({myFundings.length})
        </button>
        <button
          onClick={handleClickButton}
          name="friendsFunding"
          className={
            buttonSelected === "friendsFunding"
              ? `w-3/6 bg-cusColor3 p-4 text-xs text-white `
              : `w-3/6 border-b border-t border-cusColor3 p-4 text-xs`
          }
        >
          내가 참여한 펀딩 ({myAttendance.length})
        </button>
      </div>

      {/* 나의 펀딩, 참여 펀딩 목록 */}
      <div id="mainSection" className=" flex-center w-full flex-col p-4">
        <SearchBar />
        {buttonSelected === "myFunding" ? ( // buttonSelected에 따라 조건부 렌더링
          myFundings.length === 0 ? (
            <div className="m-1 flex flex-col items-center justify-start p-10 font-cusFont3 text-[20px]">
              아직 만들어진 펀딩이 없습니다.{" "}
            </div>
          ) : (
            <CardList data={myFundings} basePath="/my-funding-detail" />
          )
        ) : (
          myAttendance.length === 0 ? (
            <div className="m-1 flex flex-col items-center justify-start p-10 font-cusFont3 text-[20px]">
              아직 참여한 펀딩이 없습니다.{" "}
            </div>
          ) : (
            <CardList data={myAttendance} basePath="/friend-funding-detail" />
          )
        )}
      </div>

      {/* 펀딩 생성 버튼 */}
      <button
        onClick={handleCreateFundingClick}
        className="fixed bottom-24 right-4 flex h-12 w-12 flex-col items-center justify-center rounded-full bg-cusColor3 text-white shadow-lg"
      >
        <AiOutlinePlus size="20" />
      </button>
    </div>
  );
}

export default MyFunding;
