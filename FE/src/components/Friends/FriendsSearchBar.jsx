import refreshIcon from "/imgs/refreshIcon.png";
import searchIcon from "/imgs/searchIcon.png";
import searchIconTrue from "/imgs/searchIconTrue.png";
import filterIcon from "/imgs/filterIcon.png";
import filterIconTrue from "/imgs/filterIconTrue.png";

const FriendsSearchBar = ({
  isSearch,
  searchState,
  filterState,
  isFilter,
  handleInput,
  userInput,
  handleKAKAO,
  handleFilterOption,
  filterOption
}) => {
  return (
    <div className="absolute top-[60px] flex w-full flex-row justify-between">
      <div className="flex flex-row items-center p-3 ">
        <button onClick={handleKAKAO}>
          <img src={refreshIcon} alt="동기화아이콘" />
        </button>
      </div>

      <div className="flex flex-row items-center p-2.5">
        {isSearch && (
          <input
            type="text"
            className="m-1 h-[25px] w-[155px] rounded-[10px] border border-cusColor3 p-2"
            value={userInput}
            onChange={handleInput}
          />
        )}
        <button onClick={searchState} className="p-1 ">
          <img src={isSearch ? searchIconTrue : searchIcon} alt="검색아이콘" />
        </button>
        <button onClick={filterState} className="p-1 ">
          <img src={isFilter ? filterIconTrue : filterIcon} alt="필터아이콘" />
        </button>
        {isFilter && (
          <div className="absolute flex flex-col top-[60px] right-[10px] bg-white z-10 rounded-lg w-[100px]">
            <button
              className={`${filterOption === "all" ? "bg-cusColor3" : "bg-white"} rounded-lg border`}
              onClick={() => handleFilterOption("all")}
            >
              전체
            </button>
            <button
              className={`${filterOption === "favorites" ? "bg-cusColor3" : "bg-white"} rounded-lg border`}
              onClick={() => handleFilterOption("favorites")}
            >
              친한친구
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsSearchBar;
