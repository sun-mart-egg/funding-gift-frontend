import { useState } from "react";
import Down from "/imgs/down.png";

// 상수로 분리
const SORT_OPTIONS = {
  "기본 순": "0",
  "리뷰 순": "1",
  "평점 순": "2",
  "가격 높은 순": "3",
  "가격 낮은 순": "4",
};

const ToggleList = ({ onSortChange }) => {
  const [selectedToggle, setSelectedToggle] = useState("기본 순");
  const [toggleListVisible, setToggleListVisible] = useState(false);

  const handleToggle = (selected) => {
    setSelectedToggle(selected);
    onSortChange(SORT_OPTIONS[selected]);
    setToggleListVisible(false);
  };

  // 버튼 스타일을 위한 유틸리티 함수
  const getButtonStyle = (option) => 
    `${selectedToggle === option ? "bg-cusColor3 text-white" : ""} rounded p-1`;

  return (
    <div className="mt-2 flex h-[6%] w-[85.5%] items-center justify-end">
      <div className="mt-2 w-[30%]">
        <button
          className="flex w-[100%] items-center justify-center rounded-md border bg-cusColor3 px-2 py-1 text-[12px] text-white"
          onClick={() => setToggleListVisible(!toggleListVisible)}
        >
          {selectedToggle}
          <img src={Down} alt="토글 메뉴" className="ml-[5px] h-[12px] w-[9px]" />
        </button>

        {toggleListVisible && (
          <div className="absolute right-0 z-50 mt-2 w-[40%] flex-row rounded-md border border-gray-300 bg-white p-2 px-[15px] text-center text-[12px]">
            {Object.keys(SORT_OPTIONS).map((option) => (
              <button
                key={option}
                className="my-1 block w-full text-center"
                onClick={() => handleToggle(option)}
              >
                <span className={getButtonStyle(option)}>
                  {option}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ToggleList;
