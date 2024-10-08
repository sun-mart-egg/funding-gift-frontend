import FundingDetailInfo from "../../components/Funding/component/FundingDetailInfo";
import CongratulateList from "../../components/Funding/component/CongratulateList";
import BottomSheet from "../../components/Funding/component/BottomSheet";
import { useEffect, useState } from "react";
import { fetchDetailFunding } from "../../components/Funding/api/FundingAPI";
import { useParams } from "react-router-dom";
import { deleteFunding } from "../../components/Funding/api/FundingAPI";
import { useNavigate } from "react-router-dom";
import { getFundingAttendee } from "../../components/Funding/api/AttendanceAPI";
import { getAttendanceDetail } from "../../components/Funding/api/AttendanceAPI";

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
    const token = localStorage.getItem("access-token");
    if (token && fundingId) {
      fetchDetailFunding(token, fundingId, setFundingDetail);
      getFundingAttendee(token, fundingId, setAttendeeList);
    }
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
        localStorage.getItem("access-token"),
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
    const token = localStorage.getItem("access-token");
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

        <CongratulateList
          listData={attendeeList}
          onCardClick={toggleBottomSheet}
        />
      </div>

      <BottomSheet
        fundingId={fundingId}
        isOpen={isBottomSheetOpen}
        setIsOpen={setIsBottomSheetOpen}
        message={selectedMessage}
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
