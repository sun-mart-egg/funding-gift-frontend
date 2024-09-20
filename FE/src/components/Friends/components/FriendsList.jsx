const FriendsList = (props) => {
  return (
    <>
      {props.friends.map((friend, index) => (
        <div key={index} className="flex justify-between items-center">
          <img src={friend.profileThumbnail} alt="" className="w-[100px] h-[100px]" />
          <p>{friend.name}</p>
        </div>
      ))}
    </>
  );
};

export default FriendsList;
