import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query"

// API 호출
import getCategories from "../../services/Products/getCategories.js";

// 컴포넌트 호출
import SearchBar from "../../components/UI/SearchBar.jsx";
import ProductComponent from "../../components/Products/ProductComponent.jsx";
import ScrollToTopButton from "../../components/UI/ScrollToTop.jsx";

// 이미지 호출
import Categories1 from "/imgs/product_categories1.png";
import Down from "/imgs/down.png";
import ProductCategoriesBar from "../../components/Products/ProductCaregoriesBar.jsx";

function ProductPage() {
  const [keyword, setKeyword] = useState(""); // 상태 및 업데이트 함수 정의
  const [selectedButtonId, setSelectedButtonId] = useState(1);

  // 카테고리 목록 호출 쿼리
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    staleTime: 1000 * 10,
    queryFn: async () => {
      const categories = await getCategories();
      return [
        { id: 1, text: "전체", image: Categories1},
        ...categories.map((category, index) => ({
          id: index + 2,
          text: category.categoryName,
          image: category.categoryImage,
        }))
      ]
    },
  });

  // categoryId와 sort 상태 추가
  const [categoryId, setCategoryId] = useState(" "); // '전체'는 빈 문자열로 처리
  const [sort, setSort] = useState("0"); // 기본 순은 '0'

  const handleCategorySelection = (id) => {
    setSelectedButtonId(id);
    const categoryIndex = id - 1;
    const categoryMap = [" ", "1", "2", "3", "4", "5", "6"];
    setCategoryId(categoryMap[categoryIndex]);
  };
  useEffect(() => {}, [categoryId, sort]);

  // 토글 목록 보이기/숨기기 상태를 관리하는 state 변수 추가
  const [toggleListVisible, setToggleListVisible] = useState(false);

  const handleToggle = (selectedToggle) => {
    setSelectedToggle(selectedToggle);
    // 정렬 기준 업데이트
    const sortMap = {
      "기본 순": "0",
      "리뷰 순": "1",
      "평점 순": "2",
      "가격 높은 순": "3",
      "가격 낮은 순": "4",
    };
    setSort(sortMap[selectedToggle]);
    setToggleListVisible(false);
  };

  // 선택된 옵션을 관리하는 state 변수 추가
  const [selectedToggle, setSelectedToggle] = useState("기본 순");

  // 토글 목록 보이기/숨기기 함수
  const toggleListVisibility = () => {
    setToggleListVisible(!toggleListVisible);
  };

  // 토글 선택 함수
  const selectToggle = (toggle) => {
    let toggleType;
    switch (toggle) {
      case "기본 순":
        toggleType = "기본 순";
        break;
      case "리뷰 순":
        toggleType = "리뷰 순";
        break;
      case "평점 순":
        toggleType = "평점 순";
        break;
      case "가격 높은 순":
        toggleType = "가격 높은 순";
        break;
      case "가격 낮은 순":
        toggleType = "가격 낮은 순";
        break;
      default:
        toggleType = "기본 순"; // 기본값 설정
        break;
    }
    setSelectedToggle(toggle);
    handleToggle(toggleType);
  };

  return (
    <>
      <div className="main-layer font-cusFont2">
        {/* 검색 창 */}
        <div className="mb-[20px] w-[94.5%]">
          <SearchBar
            setKeyword={setKeyword}
            onSubmit={() => {}} // 어떤 역할인지 모르겠음.
          />
        </div>

        {/* 카테고리 목록 영역 */}
        <ProductCategoriesBar categories={categories}
        isSelected={selectedButtonId}
        onSelect={handleCategorySelection}/>
        

        {/* 물품 수, 정렬순서 토글, 필터 */}
        <div className="mt-2 flex h-[6%] w-[85.5%] items-center justify-between">
          <div>
            <span className="text-[12px]"></span>
          </div>
          <div className="mt-2 w-[30%]">
            <button
              className="flex w-[100%] items-center justify-center rounded-md border bg-cusColor3 px-2 py-1 text-[12px] text-white"
              onClick={toggleListVisibility}
            >
              {selectedToggle}
              <img src={Down} alt="" className="ml-[5px] h-[12px] w-[9px]" />
            </button>
            {/* 토글 목록 */}
            {toggleListVisible && (
              <div className="absolute right-0 z-50 mt-2 w-[40%] flex-row rounded-md border border-gray-300 bg-white p-2 px-[15px] text-center text-[12px]">
                <button
                  className="my-1 block w-full text-center"
                  onClick={() => selectToggle("기본 순")}
                >
                  <span
                    className={`${selectedToggle === "기본 순" ? "bg-cusColor3 text-white" : ""} rounded p-1`}
                  >
                    기본 순
                  </span>
                </button>
                <button
                  className="my-1 block w-full text-center"
                  onClick={() => selectToggle("리뷰 순")}
                >
                  <span
                    className={`${selectedToggle === "리뷰 순" ? "bg-cusColor3 text-white" : ""} rounded p-1`}
                  >
                    리뷰 순
                  </span>
                </button>
                <button
                  className="my-1 block w-full text-center"
                  onClick={() => selectToggle("평점 순")}
                >
                  <span
                    className={`${selectedToggle === "평점 순" ? "bg-cusColor3 text-white" : ""} rounded p-1`}
                  >
                    평점 순
                  </span>
                </button>
                <button
                  className="my-1 block w-full text-center"
                  onClick={() => selectToggle("가격 높은 순")}
                >
                  <span
                    className={`${selectedToggle === "가격 높은 순" ? "bg-cusColor3 text-white" : ""} rounded p-1`}
                  >
                    가격 높은 순
                  </span>
                </button>
                <button
                  className="my-1 block w-full text-center"
                  onClick={() => selectToggle("가격 낮은 순")}
                >
                  <span
                    className={`${selectedToggle === "가격 낮은 순" ? "bg-cusColor3 text-white" : ""} rounded p-1`}
                  >
                    가격 낮은 순
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 물품 목록 */}
        <ProductComponent
          categoryId={categoryId}
          keyword={keyword}
          sort={sort}
        />

        <ScrollToTopButton />
      </div>
    </>
  );
}

export default ProductPage;
