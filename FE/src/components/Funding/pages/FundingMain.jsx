import { useEffect, useState } from "react";

//Component
import StoryList from "../component/StoryList";
import FundingList from "../component/FundingList";
import ScrollToTopButton from "../../UI/ScrollToTop";

//API
import {
  getStoryList,
  getFundingFeed,
} from "../../../services/Funding/fundingMain.js";
import { getConsumers } from "../../../services/Consumer/consumers";

function FundingMain() {
  const [storyList, setStoryList] = useState([]); // 친구목록 받아올 배열
  const [feedData, setFeedData] = useState([]);
  const [userInfo, setUserInfo] = useState({
    name: "",
    img: null,
    // 추가 정보가 있다면 여기에 포함할 수 있습니다.
  });

  useEffect(() => {
    //스토리 리스트 불러오기
    getStoryList().then((storyListData) => {
      setStoryList(Array.isArray(storyListData) ? storyListData : []);
    });

    //사용자 정보 불러오기
    getConsumers().then((data) => {
      if (data) {
        setUserInfo({
          ...userInfo,
          name: data.name,
          img: data.profileImageUrl,
        });
      }
    });

    //펀딩 피드 정보 불러오기
    getFundingFeed().then((data) => {
      if (data) {
        setFeedData(data);
      }
    });
  }, []);

  return (
    <div className="sub-layer relative">
      <div className="story absolute inset-x-0 top-14 flex justify-start border-b border-gray-400 font-cusFont3 text-xs">
        <div className="MyStory flex-none flex-col items-center justify-center p-4">
          <img
            src={userInfo.img}
            alt={userInfo.name}
            className="h-14 w-14 rounded-full" // 너비와 높이를 24로 설정
          />
          <p className="text-center">{userInfo.name}</p>
        </div>
        <div className="friendStory  flex overflow-x-auto">
          <StoryList listData={storyList} />
        </div>
      </div>

      <div className="main absolute top-44 w-full  pb-24">
        <FundingList listData={feedData} friendsData={storyList} />
      </div>
      <ScrollToTopButton className="bottom-[25px]" />
    </div>
  );
}

export default FundingMain;
