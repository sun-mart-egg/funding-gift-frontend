import { useState, useRef, forwardRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // useNavigate 사용
import { useQuery } from "@tanstack/react-query";
import "react-datepicker/dist/react-datepicker.css";

//store
import { useStore } from "../../Store/MakeStore";
import useFormDataStore from "../../Store/FormDataStore";
import useUserStore from "../../Store/UserStore";

//api
import { getAnniversaryList } from "../../../services/Funding/getAnniversaryList";
import { postFunding } from "../../../services/Funding/postFunding";
import getProductDetail from "../../../services/Products/getProductDetail";

//page
import FundingStep0 from "../../../pages/Funding/MakeFunding/FundingStep0";
import FundingStep1 from "../../../pages/Funding/MakeFunding/FundingStep1";
import FundingStep2 from "../../../pages/Funding/MakeFunding/FundingStep2";
import FundingStep3 from "../../../pages/Funding/MakeFunding/FundingStep3";
import FundingStep4 from "../../../pages/Funding/MakeFunding/FundingStep4";

function MakeFundingDetail() {
  const [accessToken, setAccessToken] = useState(""); //토큰
  const navigate = useNavigate(); // useNavigate 훅 사용
  const location = useLocation(); // useLocation 훅 사용
  const ref = useRef(null); // DatePicker에 대한 ref를 생성합니다.

  const { formData, updateFormData } = useFormDataStore();
  const [anniversaryCategory, setAnniversaryCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [showDatePicker, setShowDatePicker] = useState(false);

  const {
    contentIndex, //현재 페이지
    setContentIndex, //현재 페이지 설정
    selectedAnniversary, //기념일
    selectedAddress, //주소
    selectedAccount, //계좌
  } = useStore();

  //사용자 이름, 핸드폰 번호
  const { name, phoneNumber } = useUserStore();

  // 상품 ID
  const productId = location?.state?.params;

  //react-Query 이용해서 getProductDetail 호출 해서 product에 정보 return
  const { data: product = null } = useQuery({
    queryKey: ["products", productId],
    queryFn: async () => {
      const response = await getProductDetail(productId);
      return response.data;
    },
    staleTime: 1000 * 10,
    onError: (err) => {
      console.error("product 상세정보 호출 실패", err);
    },
    enabled: !!productId,
  });

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

  //처음 화면 렌더링 되었을 때
  useEffect(() => {
    if (name) {
      console.log("이름 : ", name);
      updateFormData("name", name);
    }
  }, []);

  //커스텀된 datapicker 버튼
  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <button
      onClick={() => setShowDatePicker(true)}
      ref={ref}
      className="calendar-button common-btn h-6 bg-gray-500 text-xs"
    >
      선택
    </button>
  ));

  // product 상태가 변경될 때마다 실행되는
  useEffect(() => {
    if (product) {
      console.log("product : " + product);
      console.log("option : " + location.state.option);
      updateFormData("targetPrice", product.price);
      updateFormData("productId", product.productId);
      updateFormData("productOptionId", location.state.option);
    }
  }, [product]);

  useEffect(() => {
    const token = localStorage.getItem("access-token");
    setAccessToken(token);
    console.log(location.state);

    getAnniversaryList(token, setAnniversaryCategory);

    if (selectedAnniversary) {
      updateFormData("anniversaryDate", selectedAnniversary.anniversaryDate);
    }
    if (selectedAccount) {
      updateFormData("accountBank", selectedAccount.accountBank);
      updateFormData("accountNo", selectedAccount.accountNo);
    }
    if (selectedAddress) {
      updateFormData("phoneNumber", selectedAddress.phoneNumber);
      updateFormData("defaultAddr", selectedAddress.defaultAddr);
      updateFormData("detailAddr", selectedAddress.detailAddr);
      updateFormData("zipCode", selectedAddress.zipCode);
    }
  }, [selectedAnniversary, selectedAccount, updateFormData]);

  // 다음 컨텐츠를 보여주는 함수
  const handleNext = async () => {
    //4페이지 이하일 경우 index를 하나 높인다
    if (contentIndex < 4) {
      setContentIndex(contentIndex + 1);
    }
    //4페이지일 경우 펀딩을 생성하고 펀딩 생성 완료 페이지로 이동한다. 실패시 에러 메시지 콘ㅌ솔 출력
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

  // 날짜 범위 변경 핸들러
  const handleDateChange = (dates) => {
    const [start, end] = dates;
    if (start instanceof Date) {
      const startInKorean = toKoreanTimeZone(start);
      updateFormData("startDate", startInKorean);
    } else {
      updateFormData("startDate", null);
    }
    if (end instanceof Date) {
      const endInKorean = toKoreanTimeZone(end);
      updateFormData("endDate", endInKorean);
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
