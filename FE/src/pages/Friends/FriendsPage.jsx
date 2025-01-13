import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// API 호출
import { getFriendsList, getKAKAO, putFavorite} from "../../services/Friends/friends.js";

// 컴포넌트 호출
import FriendsList from "../../components/Friends/FriendsList.jsx";
import FriendsSearchBar from "../../components/Friends/FriendsSearchBar.jsx";

const FriendPage = () => {
  const [userInput, setUserInput] = useState(""); // 친구이름 검색
  const [filterOption, setsFilterOption] = useState("all"); // 전체, 친한친구 목록 출력
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 친구목록 쿼리
  const { data: friends = [], refetch } = useQuery({
    queryKey: ["friends"],
    queryFn: getFriendsList,
    onError: (err) => (
      console.error(err)
    )
  });

  // 친한친구 수정 mutate
  // 요청에 성공하는 경우, 쿼리키가 friends인 쿼리에 대해
  // 데이터가 오래되었으니 즉시 새로운 데이터를 가져오라고 알린다
  const editFavoriteMutate = useMutation({
    mutationFn: (consumerId) => putFavorite(consumerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] })
    },
    onError: (err) => {
      console.error(err);
    },
  });

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

  // KAKAO 친구목록과 동기화
  const handleSynkKAKAO = async () => {
    try {
      await getKAKAO();
      await refetch();
    } catch (err) {
      console.error("카카오 친구목록 동기화 실패", err);
    }
  };

  // 친한친구 수정
  const handleFavorite = async (consumerId) => {
    await editFavoriteMutate.mutate(consumerId);
  };

  // 전체, 친한친구 필터링을 위한 핸들러 함수
  const handleFilterOption = (option) => {
    setsFilterOption(option)
  };

  return (
    <div className="sub-layer">
        <FriendsSearchBar
          userInput={userInput}
          filterOption={filterOption}
          handleInput={handleInput}
          handleKAKAO={handleSynkKAKAO}
          handleFilterOption={handleFilterOption}
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
