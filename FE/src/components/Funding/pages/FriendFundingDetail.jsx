import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

//Component
import FundingDetailInfo from "../component/FundingDetailInfo";
import CongratulateList from "../component/CongratulateList";
import BottomSheet from "../component/BottomSheet";

//API
import { getFundingAttendee } from "../api/AttendanceAPI";
import { getDetailFunding } from "../../../services/Funding/fundings";

function FriendFundingDetail() {
  const navigate = useNavigate();
  const myParticipate = {
    date: "2024.3.19.12:00",
    price: 100,
    title: "시은아 생일 축하해",
    detail:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis nunc erat, tincidunt nec efficitur nec, porta vitae ipsum. Nunc cursus pretium sapien non tristique. Donec feugiat nec erat ut ultricies. Mauris eleifend id erat id finibus. Sed suscipit justo nisi, id tincidunt lectus porttitor et. Proin id viverra felis, pulvinar ullamcorper lectus. Quisque lacinia euismod laoreet. Aenean ornare metus varius pellentesque egestas. Vivamus faucibus libero eu ornare pretium. Duis porta laoreet erat id condimentum.Ut ligula felis, suscipit quis velit non, aliquam viverra tellus. Etiam id commodo urna. Morbi dictum quam et turpis rutrum, ac ornare turpis dapibus. Morbi consectetur ex vel ante commodo, sit amet mattis risus gravida. Mauris gravida sit amet libero at commodo. Sed sagittis elit tristique auctor blandit. Quisque purus urna, imperdiet id cursus et, consequat at nisl. Duis egestas augue vitae enim dictum semper. Quisque a efficitur erat. In non purus sit amet nunc rhoncus consectetur eget sed nisl. Sed id ligula dui. Aenean viverra fringilla quam, in scelerisque dolor malesuada et. Donec tortor lorem, vulputate vitae molestie ac, feugiat in lorem. Duis auctor et orci at pellentesque. Donec tempus leo nec dignissim consequatIn id suscipit enim. Nullam fringilla condimentum pretium. In congue interdum eros, ac pellentesque metus consequat in. Vivamus imperdiet, magna id facilisis dictum, orci eros scelerisque quam, vel hendrerit ligula arcu quis massa. Vivamus eget ligula non quam bibendum consectetur vel tincidunt orci. Fusce nibh nisi, tempus sit amet vehicula at, varius at ipsum. Curabitur lacinia euismod urna, sed scelerisque tellus ultrices at. Sed eu pharetra mauris, eget elementum mi. Nulla vestibulum erat id nisi ullamcorper, non consectetur libero tempus. Integer tortor massa, varius quis mi porta, maximus sagittis ante. Quisque interdum eros sit amet justo vestibulum lacinia.Aliquam feugiat massa magna, a efficitur enim rhoncus ac. Vestibulum tristique orci at molestie laoreet. In ullamcorper lectus et nisl fermentum vestibulum. Praesent sagittis sed odio id commodo. Duis nisl libero, maximus lobortis elit luctus, pharetra accumsan ipsum. Donec molestie sem ac massa elementum, ut maximus urna ultrices. Mauris dapibus urna quis erat accumsan, sed imperdiet purus mattis.Donec non nisi fermentum, laoreet dolor eu, placerat lorem. Donec iaculis eleifend mollis. Phasellus vel suscipit eros. Maecenas eget nibh erat. In hac habitasse platea dictumst. In nec arcu in purus finibus rutrum in ut sapien. Vivamus vulputate tellus in tortor vulputate convallis. Nulla facilisi. Pellentesque non eros id libero pellentesque iaculis. Donec nec faucibus erat. Quisque sed libero risus. Maecenas in lorem non urna placerat vehicula ac non nulla. Etiam vitae scelerisque orci. Vivamus pharetra finibus nunc at luctus.",
    reply: "ㄳㄳ",
  };

  const { fundingId } = useParams(); // URL 파라미터에서 fundingId를 가져옵니다.
  const [fundingDetail, setFundingDetail] = useState(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen, selectId] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState("");
  const [attendeeList, setAttendeeList] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access-token");
    if (token && fundingId) {
      getDetailFunding(fundingId).then((response) => {
        setFundingDetail(response);
      });
      getFundingAttendee(token, fundingId, setAttendeeList);
    }
  }, [fundingId]);

  useEffect(() => {
    if (fundingDetail) {
      console.log("Funding Detail Loaded: ", fundingDetail);
    }
  }, [fundingDetail]);

  const toggleBottomSheet = () => {
    setSelectedMessage(myParticipate);
    setIsBottomSheetOpen(!isBottomSheetOpen);
  };

  const handleItemClick = () => {
    alert("다른사람의 메세지 내용은 볼 수 없습니다.");
  };

  if (!fundingDetail) return <div>Loading...</div>;

  return (
    <div className="sub-layer font-cusFont3">
      <div
        id="page"
        className="absolute top-20 flex flex-col items-center justify-start pb-20"
      >
        {/* 펀딩정보 */}
        <FundingDetailInfo
          title={fundingDetail.title}
          name={fundingDetail.productName}
          detail={fundingDetail.content}
          progress={(fundingDetail.sumPrice / fundingDetail.targetPrice) * 100}
          price={fundingDetail.targetPrice}
          img={fundingDetail.productImage}
          startDate={fundingDetail.startDate}
          endDate={fundingDetail.endDate}
          fundingStatus={fundingDetail.fundingStatus}
        />

        {/* 내가 참여한 펀딩 정보 */}
        <div className="px-2 font-cusFont2 text-[18px]">
          <p>내가 참여한 펀딩</p>
        </div>

        {/* 축하해준 사람 목록 */}
        <CongratulateList
          listData={attendeeList}
          onCardClick={handleItemClick}
        />
      </div>

      {/* 펀딩 진행중일 경우 펀딩 참여하기 버튼 */}
      {fundingDetail.fundingStatus === "IN_PROGRESS" &&
        (myParticipate.price == null ? (
          <button
            className="fixed bottom-5 h-[45px] w-[80%] rounded-md bg-cusColor3 text-white"
            onClick={() => navigate(`/participate/${fundingId}`)}
          >
            펀딩 참여하기
          </button>
        ) : (
          <button
            className="fixed bottom-5 h-[45px] w-[80%] rounded-md bg-cusColor3 text-white"
            onClick={() => navigate(`/participate/${fundingId}`)}
          >
            펀딩 참여하기
          </button>
        ))}

      {/* 메세지 바텀시트 */}
      <BottomSheet
        isOpen={isBottomSheetOpen}
        setIsOpen={setIsBottomSheetOpen}
        message={selectedMessage}
      ></BottomSheet>
    </div>
  );
}

export default FriendFundingDetail;
