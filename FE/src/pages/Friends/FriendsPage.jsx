import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import temp_img from "/imgs/cat.PNG";

import FriendsList from "../../components/Friends/components/FriendsList";
import FriendsSearchBar from "../../components/Friends/components/FriendsSearchBar";

const FriendPage = () => {
  // const [isSearch, setIsSearch] = useState(false); // 검색창 on/off 위한 상태변수
  // const [isFilter, setIsFilter] = useState(false); // 필터창 on/off 위한 상태변수
  // const [friends, setFriends] = useState([]); // 친구목록 받아올 배열
  // const [userInput, setUserInput] = useState(""); // 친구이름 검색

  // dummy data
  const friends = [
    {
      name: "test1",
      profileThumbnail: temp_img,
    },
    {
      name: "test2",
      profileThumbnail: temp_img,
    },
    {
      name: "test3",
      profileThumbnail: temp_img,
    },
    {
      name: "test4",
      profileThumbnail: temp_img,
    },
    {
      name: "test5",
      profileThumbnail: temp_img,
    },
    {
      name: "test6",
      profileThumbnail: temp_img,
    },
  ];
  // const [filterOption, setsFilterOption] = useState("all") // 전체, 친한친구 목록 출력
  // const navigate = useNavigate()

  return (
    <div className="sub-layer justify-start">
      <div className="w-full absolute top-[70px]">
        <FriendsList friends={friends}/>
      </div>
    </div>
  );
};

export default FriendPage;
