import fish from "/imgs/fish.PNG";
import star from "/imgs/star.png";
import graystar from "/imgs/graystar.png";

const FriendsList = ({ friends, handleFavorite, navigate }) => {
  return (
    <div className="fixed top-[110px] flex h-full max-h-[calc(100vh-90px)] w-full max-w-[500px] flex-col items-center justify-start">
      <div className="w-full h-full gap-3 overflow-y-scroll">
        {friends.map((friend, index) => (
          <div
            key={index}
            className="flex flex-row items-center justify-between gap-3 m-2"
          >
            <div
              className="flex flex-row items-center gap-3"
              key={friend.consumerId}
              onClick={() => navigate(`/friend-funding/${friend.consumerId}`)}
            >
              <img
                src={friend.profileThumbnailImage === "" ? fish : friend.profileThumbnailImage}
                alt="카톡프사"
                className="h-[100px] w-[100px] rounded-lg"
              />
              <h1 className="text-xl font-bold signup-font">
                {friend.profileNickname}
              </h1>
            </div>
            <button onClick={() => handleFavorite(friend.consumerId)}>
              <img src={friend.favorite ? star : graystar} alt="친한친구 유무" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendsList;
