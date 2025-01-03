import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// API 호출
import getFriendsList from "../../services/Friends/getFriendsList.js";
import getKAKAO from "../../services/Friends/getKAKAO.js";
import putFavorite from "../../services/Friends/putFavorite.js";

// 컴포넌트 호출
import FriendsList from "../../components/Friends/FriendsList.jsx";
import FriendsSearchBar from "../../components/Friends/FriendsSearchBar.jsx";

const FriendPage = () => {
  const [isSearch, setIsSearch] = useState(false); // 검색창 on/off 위한 상태변수
  const [isFilter, setIsFilter] = useState(false); // 필터창 on/off 위한 상태변수
  const [friends, setFriends] = useState([]); // 친구목록 받아올 배열
  const [userInput, setUserInput] = useState(""); // 친구이름 검색
  const [filterOption, setsFilterOption] = useState("all"); // 전체, 친한친구 목록 출력
  const navigate = useNavigate();

  const searchState = () => {
    setIsSearch((prevSearch) => !prevSearch);
  };
  const filterState = () => {
    setIsFilter((prevFilter) => !prevFilter);
  };

  // 친구 이름 검색 입력에 대한 함수
  const handleInput = (event) => {
    setUserInput(event.target.value);
  };

  // 친구목록 필터링
  // 필터아이콘 클릭하면 전체, 친한친구가 나온다.
  // 기본값은 전체, 친한친구를 클릭 시 (filterOption === "favorites") 친구목록에서 favorite가 true인 친구들만 출력된다.
  const filteredFriends = () => {
    if (filterOption === "favorites") {
      return friends.filter(
        (friend) =>
          friend.favorite && friend.profileNickname.includes(userInput),
      );
    } else {
      return friends.filter((friend) =>
        friend.profileNickname.includes(userInput),
      );
    }
  };

  useEffect(() => {
    loadFriends();
  }, []);

  // REDIS에 친구목록 요청하는 API
  const loadFriends = async () => {
    try {
      const friendsList = await getFriendsList();
      setFriends(friendsList);
    } catch (err) {
      console.error("친구목록 불러오기 실패", err);
    }
  };

  const syncKAKAO = async () => {
    try {
      await getKAKAO();
      await loadFriends();
    } catch (err) {
      console.error("카카오 친구목록 동기화 실패", err);
    }
  };

  const handleFavorite = async (consumerId) => {
    try {
      await putFavorite(consumerId);
      setFriends((prevFriends) => 
        prevFriends.map((friend) => 
          friend.consumerId === consumerId
            ? { ...friend, favorite: !friend.favorite }
            : friend
        )
      );
    } catch (err) {
      console.error("친한친구 설정 실패", err);
    }
  };

  // 전체, 친한친구 필터링을 위한 핸들러 함수
  const handleFilterOption = (option) => {
    setsFilterOption(option)
  }

  return (
    <div className="sub-layer justify-start">
        <FriendsSearchBar
          isSearch={isSearch}
          searchState={searchState}
          filterState={filterState}
          isFilter={isFilter}
          handleInput={handleInput}
          userInput={userInput}
          handleKAKAO={syncKAKAO}
          handleFilterOption={handleFilterOption}
          filterOption={filterOption}
        />
        <FriendsList
          friends={filteredFriends()}
          handleFavorite={handleFavorite}
          navigate={navigate}
        />
    </div>
  );
};

export default FriendPage;
