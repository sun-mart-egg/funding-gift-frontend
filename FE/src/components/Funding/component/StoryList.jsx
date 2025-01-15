//component
import StoryProfile from "./StoryProfile";

function StoryList({ listData, onClick }) {
  return (
    <div
      id="storyList"
      className="flex w-full overflow-x-scroll font-cusFont3 text-[12px]"
    >
      {Array.isArray(listData) &&
        listData.map((item, idx) => (
          <div key={item.consumerId || idx}>
            <StoryProfile
              onClick={() => onClick(item.consumerId)}
              name={item.name}
              img={item.profileImageUrl}
            />
          </div>
        ))}
    </div>
  );
}

export default StoryList;
