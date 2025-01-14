import { useEffect, useState } from "react";
import DaumPostcodeEmbed from "react-daum-postcode";
import { postAddress, getAddressList } from "../../services/Address/addresses";
import { useNavigate, useLocation } from "react-router";

function AddressFormPage() {
  // 상세주소 검색창 on/off 상태변수
  const [isOpen, setIsOpen] = useState(false);
  const [zipCode, setZipcode] = useState("");
  const [defaultAddress, setDefaultAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [addressName, setAddressName] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  //수정 모드, 추가 모드 설정
  const addressId = location?.state?.addressId || null;
  const isEditMode = !!addressId;

  // //수정 모드일때 기존 주소 정보 불러오기
  // // 1) 수정 모드일 때, 기존 주소 정보 불러오기
  // useEffect(() => {
  //   if (isEditMode) {
  //     // addressId가 존재하면 서버에서 해당 주소 정보를 가져와 폼에 세팅
  //     getAddressList(localStorage.getItem("access-token"), addressId)
  //       .then((res) => {
  //         const { name, defaultAddr, detailAddr, zipCode, isDefault } =
  //           res.data;
  //         // 서버 응답 구조에 맞춰 조정
  //         setAddressName(name);
  //         setZipcode(zipCode);
  //         setDefaultAddress(defaultAddr);
  //         setDetailAddress(detailAddr);
  //         setIsDefault(isDefault);
  //       })
  //       .catch((err) => {
  //         console.error("주소 정보 불러오기 실패:", err);
  //         // 적절히 에러 핸들링
  //       });
  //   }
  // }, [isEditMode, addressId]);

  const handleAddress = (data) => {
    setZipcode(data.zonecode);
    setDefaultAddress(data.address);
    setIsOpen(false);
  };

  const handleAddressNameChange = (event) => {
    setAddressName(event.target.value);
  };

  const handleDetailAddress = (event) => {
    setDetailAddress(event.target.value);
  };

  const handleIsDefault = () => {
    setIsDefault((prevIsDefault) => !prevIsDefault);
    console.log(isDefault);
  };

  const handleCreate = () => {
    postAddress(addressName, defaultAddress, detailAddress, zipCode, isDefault);
    navigate("/address-list");
  };
  return (
    <div className="sub-layer font-cusFont3">
      <div className="title flex w-full items-center justify-center ">
        <p className="absolute top-20 font-cusFont5 text-[30px]">배송지 추가</p>
      </div>
      <div className="content absolute top-32 w-full p-4 font-cusFont3">
        <div className="addressName mb-6">
          <p className="mb-2 font-cusFont2 text-[18px]">배송지 이름</p>
          <input
            id="addressName"
            type="text"
            placeholder="배송지의 이름을 입력하세요 ex)본가"
            value={addressName}
            onChange={handleAddressNameChange}
            className="h-[44px] w-full rounded-md border border-[#9B9B9B] px-2 placeholder:text-[14px] focus:border-cusColor3 focus:outline-none"
          />
        </div>
        <div className="zipCode pb-6">
          <p className="mb-2 font-cusFont2 text-[18px]">우편번호</p>
          <div className="flex justify-between">
            <div className="flex h-[44px] w-[60%] items-center rounded-md border border-[#9B9B9B] px-2">
              <p>{zipCode ? zipCode : "우편번호를 검색하세요"}</p>
            </div>
            <button
              className="rounded-md bg-[#9B9B9B] p-2 text-white"
              onClick={() => setIsOpen(true)}
            >
              우편번호 검색{" "}
            </button>
          </div>
        </div>
        <div className="address pb-6">
          <p className="mb-2 font-cusFont2 text-[18px]">주소</p>
          <div className="defaultAddress pb-2">
            <div className="flex h-[44px] w-full items-center rounded-md border border-[#9B9B9B] px-2">
              <p>{defaultAddress ? defaultAddress : "주소를 검색하세요"}</p>
            </div>
          </div>
          <div className="detailAddress">
            <input
              type="text"
              placeholder="상세 주소를 입력하세요"
              value={detailAddress}
              onChange={handleDetailAddress}
              className="h-[44px] w-full rounded-md border border-[#9B9B9B] px-2 placeholder:text-[14px] focus:border-cusColor3 focus:outline-none"
            />
          </div>
        </div>
        <div className="isPrimaryAddress flex justify-between">
          <p>기본 배송지로 설정 하시겠습니까?</p>
          <input type="checkbox" value={isDefault} onChange={handleIsDefault} />
        </div>
      </div>
      {isOpen && (
        <div className="absolute top-20 z-50 flex h-[85%] w-full max-w-[400px] flex-col items-center justify-center gap-4 border-2 bg-white">
          <DaumPostcodeEmbed onComplete={handleAddress} autoClose />
          <button
            className="common-btn h-[45px] w-[75%]"
            onClick={() => setIsOpen(false)}
          >
            닫기
          </button>
        </div>
      )}
      <div className="absolute bottom-0 flex w-full items-center justify-center space-x-4 pb-5">
        <button onClick={handleCreate} className="common-btn h-[45px] w-[75%]">
          배송지 추가하기
        </button>
      </div>
    </div>
  );
}

export default AddressFormPage;
