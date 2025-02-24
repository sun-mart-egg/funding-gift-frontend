import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../../../@common/cookies";

//Component
import FundingDetailInfo from "../component/FundingDetailInfo";
import CongratulateList from "../component/CongratulateList";
import BottomSheet from "../component/BottomSheet";

//API
import { deleteFunding } from "../api/FundingAPI";
import { getAttendanceDetail } from "../api/AttendanceAPI";
import { getDetailFunding } from "../../../services/Funding/fundings";
import { getAttendanceList } from "../../../services/Funding/attendance";

function MyFundingDetail() {
  const navigate = useNavigate();

  const { fundingId } = useParams(); // URL 파라미터에서 fundingId를 가져옵니다.
  const [fundingDetail, setFundingDetail] = useState(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState("");
  const [messageList, setMessageList] = useState();
  const [attendeeList, setAttendeeList] = useState([]);
  const [attendanceDetail, setAttendanceDetail] = useState(null);

  useEffect(() => {
    //펀딩 디테일 정보 불러오기
    getDetailFunding(fundingId).then((response) => {
      setFundingDetail(response);
    });

    //펀딩 참여자 목록 불러오기
    getAttendanceList(fundingId, 0, 8, "").then((response) => {
      setAttendeeList(response);
    });
  }, [fundingId]);

  useEffect(() => {
    if (fundingDetail) {
      console.log("Funding Detail Loaded: ", fundingDetail);
    }
    if (attendeeList) {
      console.log("참여 정보 목록 불러오기 완료", attendeeList);
    }
  }, [fundingDetail, attendeeList]);

  const toggleBottomSheet = (message) => {
    if (!isBottomSheetOpen) {
      setSelectedMessage(message);
      getAttendanceDetail(
        getCookie("access-token"),
        fundingId,
        message.attendanceId,
        setAttendanceDetail,
      );
    }
    setIsBottomSheetOpen(!isBottomSheetOpen);
  };

  if (!fundingDetail) return <div>Loading...</div>;

  const updateReply = (name, newReply) => {
    const newList = messageList.map((msg) =>
      msg.name === name ? { ...msg, reply: newReply } : msg,
    );
    setMessageList(newList);

    // selectedMessage 상태도 업데이트
    if (selectedMessage && selectedMessage.name === name) {
      setSelectedMessage({ ...selectedMessage, reply: newReply });
    }
  };

  const handleDelete = async () => {
    const token = getCookie("access-token");
    if (token && fundingId) {
      deleteFunding(token, fundingId, navigate);
    }
  };
  return (
    <div className="sub-layer font-cusFont3">
      <div
        id="page"
        className="absolute top-20 flex flex-col items-center justify-start pb-20"
      >
        {/* 펀딩 정보 */}
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

        {/* 축하 받은 리스트  */}
        <CongratulateList
          listData={attendeeList}
          onCardClick={toggleBottomSheet}
        />
      </div>

      {/* 메시지 보기 */}
      <BottomSheet
        fundingId={fundingId}
        isOpen={isBottomSheetOpen}
        setIsOpen={setIsBottomSheetOpen}
        updateReply={updateReply}
        attendanceDetail={attendanceDetail} // attendanceDetail을 prop으로 추가
      ></BottomSheet>

      <button
        onClick={handleDelete}
        className="fixed bottom-5  h-[45px] w-[80%]  rounded-md bg-cusColor3 text-white"
      >
        펀딩 취소하기
      </button>
    </div>
  );
}

export default MyFundingDetail;
