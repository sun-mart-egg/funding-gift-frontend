import AddressList from "../../components/Funding/component/AddressList";
import { useStore } from "../../components/Store/MakeStore";
import { useNavigate, useLocation } from "react-router-dom"; // useNavigate 사용
import { getAddressList } from "../../services/Address/addresses";
import { useQuery } from "@tanstack/react-query";

function AddressListPage() {
  const navigate = useNavigate();
  const setContentIndex = useStore((state) => state.setContentIndex);
  const location = useLocation();

  // data: 쿼리 함수 호출로 인해 얻는 data
  // data에 기본값으로 addressList = [] 설정했는데, 그냥 data로 사용하고 props도 data로 전달해줘도 된다
  // isLoading: 데이터 불러오는 상태
  const { data: addressList = [], isLoading} = useQuery({
    queryKey: ["주소 목록"], // 해당 쿼리에 대한 key값, 나중에 mutate ( 쿼리 수정 요청할 때 ) 사용된다
    queryFn: getAddressList, // 불러올 data에 대한 함수 ( api 요청 등등.. )
    onError: (err) => { // 쿼리 호출 실패했을 때
      console.error(err);
    },
  });

  const handleSelectButtonClick = () => {
    setContentIndex(3); // 컨텐츠 인덱스를 3으로 설정
    navigate("/make-funding-detail", {
      state: { ...location.state },
    });
  };

  if (isLoading) return <div>주소 목록 로딩 중</div>;
  return (
    <div className="sub-layer font-cusFont3 text-[14px]">
      <AddressList listData={addressList} />
      <div
        id="buttonSection"
        className="absolute bottom-0 flex w-full items-center justify-center space-x-4 pb-5"
      >
        <button
          className="  common-btn border-cus  h-[45px] w-[45%] border border-cusColor3 bg-white text-black "
          onClick={() => navigate("/new-address")}
        >
          배송지 추가
        </button>
        <button
          className="  h-[45px] w-[45%]  rounded-md bg-cusColor3 text-white"
          onClick={handleSelectButtonClick}
        >
          배송지 선택
        </button>
      </div>
    </div>
  );
}

export default AddressListPage;
