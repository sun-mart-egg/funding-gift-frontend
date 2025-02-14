import fish from "/imgs/fish.PNG";
import star from "/imgs/star.png";
import graystar from "/imgs/graystar.png";
import { memo } from "react";

const FriendsList = memo(({ friends, handleFavorite, navigate }) => {
  return (
    <div className="fixed top-[110px] flex h-full max-h-[calc(100vh-90px)] w-full max-w-[500px] flex-col items-center justify-start">
      <div className="w-full h-full gap-3 overflow-y-scroll">
        {friends.map((friend) => (
          <div
            key={friend.toConsumerId}
            className="flex flex-row items-center justify-between gap-3 m-2"
          >
            <div
              className="flex flex-row items-center gap-3"
              onClick={() => navigate(`/friend-funding/${friend.toConsumerId}`)}
            >
              <img
                src={friend.profileImageUrl === "" ? fish : friend.profileImageUrl}
                alt="카톡프사"
                className="h-[100px] w-[100px] rounded-lg"
              />
              <h1 className="text-xl font-bold signup-font">
                {friend.name}
              </h1>
            </div>
            <button onClick={() => handleFavorite(friend.toConsumerId)}>
              <img src={friend.isFavorite ? star : graystar} alt="친한친구 유무" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
});

// displayName: 디버깅을 용이하게 하기 위한 속성
// memo의 콜백 함수로 익명 함수 '() => {}' 넘겨줬기 때문에
// displayName을 적어줌
FriendsList.displayName = "FriendsList";

export default FriendsList;
