import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

// API 호출
import getCategories from "../../services/Products/getCategories.js";

// 컴포넌트 호출
import SearchBar from "../../components/UI/SearchBar.jsx";
import ProductComponent from "../../components/Products/ProductComponent.jsx";
import ScrollToTopButton from "../../components/UI/ScrollToTop.jsx";
import ProductCategoriesBar from "../../components/Products/ProductCaregoriesBar.jsx";
import ToggleList from "../../components/Products/ToggleList.jsx";

// 이미지 호출
import Categories1 from "/imgs/product_categories1.png";

function ProductPage() {
  const [keyword, setKeyword] = useState(""); // 상태 및 업데이트 함수 정의
  const [selectedButtonId, setSelectedButtonId] = useState(1);

  // 카테고리 목록 호출 쿼리
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const categories = await getCategories();
      return [
        { id: 1, text: "전체", image: Categories1 },
        ...categories.map((category, index) => ({
          id: index + 2,
          text: category.categoryName,
          image: category.categoryImage,
        })),
      ];
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

  return (
    <div className="main-layer font-cusFont2">
      {/* 검색 창 */}
      <div className="mb-[20px] w-[94.5%]">
        <SearchBar
          setKeyword={setKeyword}
          onSubmit={() => {}} // 어떤 역할인지 모르겠음.
        />
      </div>

      {/* 카테고리 목록 영역 */}
      <ProductCategoriesBar
        categories={categories}
        isSelected={selectedButtonId}
        onSelect={handleCategorySelection}
      />

      {/* 물품 수, 정렬순서 토글, 필터 */}
      <ToggleList onSortChange={setSort} />

      {/* 물품 목록 */}
      <ProductComponent categoryId={categoryId} keyword={keyword} sort={sort} />

      <ScrollToTopButton />
    </div>
  );
}

export default ProductPage;
