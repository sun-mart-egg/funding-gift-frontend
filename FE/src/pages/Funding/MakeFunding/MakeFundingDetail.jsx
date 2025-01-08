// MakeFundingDetail.jsx
import { useState, useRef, forwardRef } from "react";
import { useNavigate } from "react-router-dom";

//hook
import InitFundingDetail from "../../../hooks/Funding/InitFundingDetail";

//api
import { postFunding } from "../../../services/Funding/postFunding";

//store
import { useStore } from "../../../components/Store/MakeStore";
import useFormDataStore from "../../../components/Store/FormDataStore";

// 단계 컴포넌트들
import FundingStep0 from "./FundingStep0";
import FundingStep1 from "./FundingStep1";
import FundingStep2 from "./FundingStep2";
import FundingStep3 from "./FundingStep3";
import FundingStep4 from "./FundingStep4";

// 모달
import ErrorModal from "../../../components/UI/ErrorModal";

function MakeFundingDetail() {
  //커스텀 훅
  const {
    product,
    accessToken,
    anniversaryCategory,
    selectedAccount,
    selectedAddress,
    selectedAnniversary,
  } = InitFundingDetail();
  const ref = useRef(null); // DatePicker에 대한 ref를 생성합니다.

  //상태들
  const [errorMsg, setErrorMsg] = useState(""); // 에러 메시지 상태 추가
  const { formData, updateFormData } = useFormDataStore();
  const { contentIndex, setContentIndex } = useStore();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  //단계 전환 로직
  const navigate = useNavigate();

  // 다음 컨텐츠를 보여주는 함수
  const handleNext = async () => {
    if (contentIndex === 1) {
      if (!formData.title || !formData.content) {
        setErrorMsg("펀딩 제목과 펀딩 소개를 모두 입력해 주세요");
        return;
      }
    }
    //4페이지 이하일 경우 index를 하나 높인다
    if (contentIndex < 4) {
      setContentIndex(contentIndex + 1);
    }
    //4페이지일 경우 펀딩을 생성하고 펀딩 생성 완료 페이지로 이동한다. 실패시 에러 메시지 콘솔 출력
    else {
      try {
        const result = await postFunding(formData, accessToken);
        console.log("Response from the server:", result);
        navigate("/make-funding-finish");
      } catch (error) {
        console.error("펀딩 만들기 실패", error);
      }
    }
  };

  // 이전 컨텐츠를 보여주는 함수
  const handlePrev = () => {
    if (contentIndex > 0) {
      setContentIndex(contentIndex - 1); // 상태 업데이트
    } else {
      setContentIndex(0);
    }
  };

  // 기념일 카테고리 변경 처리
  const handleCategoryChange = (event) => {
    const newCategory = event.target.value;
    setSelectedCategory(newCategory);
    updateFormData("anniversaryCategoryId", newCategory); // Zustand 스토어 업데이트
  };

  const handleAnniversaryChange = (e) => {
    const newAnniversaryDate = e.target.value;
    updateFormData("anniversaryDate", newAnniversaryDate); // Zustand 상태 업데이트
  };

  // 드롭다운 렌더링 함수
  const renderCategoryDropdown = () => (
    <select
      value={selectedCategory}
      onChange={handleCategoryChange}
      className="mt-2 h-8 w-full rounded-md border border-gray-400 p-2 text-xs"
    >
      <option value="">기념일을 선택하세요</option>
      {anniversaryCategory.map((category, index) => (
        <option key={index} value={category.anniversaryCategoryId}>
          {category.anniversaryCategoryName}
        </option>
      ))}
    </select>
  );

  //커스텀된 datapicker 버튼
  // 부모 컴포넌트 or FundingStep2
  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <button
      onClick={() => setShowDatePicker(true)} // 버튼 누르면 showDatePicker = true
      ref={ref}
      className="calendar-button common-btn h-6 bg-gray-500 text-xs"
    >
      선택
    </button>
  ));
  CustomInput.displayName = "CustomInput"; // ESLint react/display-name 방지

  // 폼 데이터를 처리하는 함수
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedValue =
      name === "minPrice"
        ? parseInt(value, 10) || 0
        : type === "checkbox"
          ? checked
          : value;
    updateFormData(name, updatedValue);
  };

  const closeModal = () => {
    setErrorMsg("");
  };

  // 날짜 범위 변경 핸들러
  // MakeFundingDetail.jsx (일부)
  const handleDateChange = (dates) => {
    const [start, end] = dates; // start, end는 Date 객체 또는 null
    if (start) {
      updateFormData("startDate", toKoreanTimeZone(start));
    } else {
      updateFormData("startDate", null);
    }
    if (end) {
      updateFormData("endDate", toKoreanTimeZone(end));
    } else {
      updateFormData("endDate", null);
    }
  };

  // 날짜를 한국 시간대로 변환하는 함수
  const toKoreanTimeZone = (date) => {
    if (date instanceof Date) {
      const userTimezoneOffset = date.getTimezoneOffset() * 60000;
      return new Date(date.getTime() + userTimezoneOffset + 9 * 60 * 60 * 1000);
    }
    return date;
  };

  // DatePicker 컴포넌트에서 사용할 날짜 표시 형식을 변환하는 함수
  const getFormattedDate = (date) => {
    if (!date) return "";

    const koreanDate = toKoreanTimeZone(date);

    return koreanDate
      .toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/. /g, "-")
      .replace(".", "");
  };

  // 현재 보여줄 컨텐츠를 결정하는 함수
  const renderContent = () => {
    if (!product) {
      // product가 로드되지 않았을 때 표시할 내용
      return <div>상품 정보를 불러오는 중...</div>;
    }
    switch (contentIndex) {
      case 0:
        return <FundingStep0 product={product} />;
      case 1:
        return (
          <FundingStep1
            formData={formData}
            handleInputChange={handleInputChange}
            errorMsg={errorMsg}
          ></FundingStep1>
        );
      case 2:
        return (
          <FundingStep2
            formData={formData}
            handleInputChange={handleInputChange}
            handleAnniversaryChange={handleAnniversaryChange}
            selectedAnniversary={selectedAnniversary}
            renderCategoryDropdown={renderCategoryDropdown}
            showDatePicker={showDatePicker}
            setShowDatePicker={setShowDatePicker}
            refDatePicker={ref}
            handleDateChange={handleDateChange}
            getFormattedDate={getFormattedDate}
            CustomInput={CustomInput}
          ></FundingStep2>
        );
      case 3:
        return (
          <FundingStep3
            selectedAddress={selectedAddress}
            selectedAccount={selectedAccount}
            navigate={navigate}
          />
        );

      case 4:
        return (
          <FundingStep4
            product={product}
            formData={formData}
            getFormattedDate={getFormattedDate}
          ></FundingStep4>
        );
      default:
        return <div>잘못된 단계 입니다.</div>;
    }
  };

  return (
    <div
      className="sub-layer font-cusFont3 "
      style={{
        background: "linear-gradient(to bottom, #E5EEFF, #FFFFFF)", // 세로 그라디언트 정의
      }}
    >
      <ErrorModal message={errorMsg} onClose={closeModal} />
      <div
        id="makeCard"
        className="mt-20 flex w-[75%] flex-col items-center justify-start rounded-xl bg-white p-4 shadow-md"
        style={{ height: "68%" }} // makeCard의 높이 조정
      >
        <div id="card-title" className="w-full">
          <p className="mb-10 text-center font-cusFont2 text-lg">
            {contentIndex === 1
              ? "펀딩정보"
              : contentIndex === 2
                ? "펀딩 디테일 정보"
                : contentIndex === 3
                  ? "사용자 정보"
                  : contentIndex === 4
                    ? "펀딩 정보 확인"
                    : ""}
          </p>
        </div>
        <div id="contentSection" className="w-full overflow-auto">
          {renderContent()}
        </div>
      </div>
      <div
        id="buttonSection"
        className="absolute bottom-0 w-full justify-around pb-5"
      >
        <div className="flex justify-center space-x-4">
          {contentIndex > 0 ? (
            <>
              <button
                onClick={handlePrev}
                style={{ width: "calc(45%)" }} // 버튼 너비 조정
                className="common-btn border-cus h-[45px] border border-cusColor3 bg-white text-black "
              >
                이전
              </button>
              <button
                onClick={handleNext}
                style={{ width: "calc(45%)" }} // 버튼 너비 조정
                className=" common-btn h-[45px]"
              >
                다음
              </button>
            </>
          ) : (
            <button
              onClick={handleNext}
              style={{ width: "calc(75% )" }} // 버튼 너비 조정
              className="common-btn h-[45px]"
            >
              다음
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MakeFundingDetail;
