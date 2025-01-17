import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

//Component
import SearchBar from "../../UI/SearchBar";
import CardList from "../component/CardList";

//API
import { getFriendFunding } from "../../../services/Funding/fundings";
import { getConsumersId } from "../../../services/Consumer/consumers";

function FriendFunding() {
  const { consumerId } = useParams(); // URL 파라미터에서 consumer-id 값을 추출합니다.
  const [friendFunding, setFriendFunding] = useState([]);
  const [FriendInfo, setFriendInfo] = useState({
    name: "",
    img: null,
    // 추가 정보가 있다면 여기에 포함할 수 있습니다.
  });

  useEffect(() => {
    //사용자 정보 받아오기
    getConsumersId(consumerId).then((data) => {
      setFriendInfo({
        name: data.name,
        img: data.profileImageUrl,
      });
    });

    //친구가 만든 펀딩 api 호출 후 state 저장
    getFriendFunding(consumerId).then((data) => {
      setFriendFunding(data);
    });
  }, [consumerId]);

  return (
    <div className="main-layer ">
      <div
        id="profileSection"
        className=" flex w-full justify-between p-2 px-6"
      >
        <div id="leftSection" className="flex items-center space-x-4">
          <img
            src={FriendInfo.img}
            alt="프로필"
            className="h-[60px] w-[60px] rounded-full  border-gray-300"
          />
          <p className="font-cusFont5 text-xl">{FriendInfo.name}</p>
        </div>
      </div>
      <div id="buttonSection" className="flex w-full justify-between  ">
        <button
          name="myFunding"
          className={`w-full bg-cusColor3 p-4 text-xs text-white `}
        >
          친구가 만든 펀딩 ({friendFunding.length})
        </button>
      </div>

      <div id="mainSection" className=" flex-center w-full flex-col p-4">
        <SearchBar />

        {friendFunding.length === 0 ? (
          <div className="m-1 flex flex-col items-center justify-start p-10 font-cusFont3 text-[20px]">
            아직 만들어진 펀딩이 없습니다.{" "}
          </div>
        ) : (
          <CardList data={friendFunding} basePath="/friend-funding-detail" />
        )}
      </div>
    </div>
  );
}

export default FriendFunding;
