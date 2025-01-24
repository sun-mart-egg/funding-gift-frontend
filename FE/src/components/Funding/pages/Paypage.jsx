import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAttendanceStore from "../../Store/AttendanceStore";
import { getCookie } from "../../../@common/cookies";

//API
import { createAttendance } from "../api/AttendanceAPI";
import { getDetailFunding } from "../../../services/Funding/fundings";
import { getConsumers } from "../../../services/Consumer/consumers";

function Paypage() {
  const navigate = useNavigate(); // useNavigate 훅을 사용합니다.
  const [fundingDetail, setFundingDetail] = useState(null);
  const { sendMessage, sendMessageTitle, price, fundingId } =
    useAttendanceStore();
  const [attendanceResponse, setAttendanceResponse] = useState();

  useEffect(() => {
    const jquery = document.createElement("script");
    jquery.src = "https://code.jquery.com/jquery-1.12.4.min.js";
    const iamport = document.createElement("script");
    iamport.src = "https://cdn.iamport.kr/js/iamport.payment-1.1.7.js";
    document.head.appendChild(jquery);
    document.head.appendChild(iamport);
    return () => {
      document.head.removeChild(jquery);
      document.head.removeChild(iamport);
    };
  }, []);

  //내 정보 받아오기
  useEffect(() => {
    getConsumers().then((data) => {
      setAttendanceResponse(data);
    });
  }, []);

  useEffect(() => {
    console.log("참여자 정보", attendanceResponse);
  }, [attendanceResponse]);

  //디테일 펀딩 정보 불러오기
  useEffect(() => {
    getDetailFunding(fundingId).then((response) => {
      setFundingDetail(response);
    });
  }, [fundingId]);

  //펀딩 정보가 로드 되기 전에 로딩 표시
  if (!fundingDetail) {
    return <div>Loading...</div>;
  }

  const handlePayment = async () => {
    try {
      requestPay().then(() => {
        const response = createAttendance(
          getCookie("access-token"),
          fundingId,
          sendMessage,
          sendMessageTitle,
          price,
        );
        // console.log("참여 후 정보 잘 받아왔나? : " + response.data.fundingName);
      });
    } catch (error) {
      console.error("결제 중 오류가 발생했습니다: ", error);
    }
  };

  const requestPay = () => {
    const { IMP } = window;
    IMP.init("imp40448376");

    IMP.request_pay(
      {
        pg: "html5_inicis.INIpayTest",
        pay_method: "card",
        merchant_uid: 100, //참여 번호
        name: fundingDetail.title, //펀딩 이름
        amount: price, //펀딩 참여 가격
        buyer_email: attendanceResponse.email, //펌딩참여자 이메일
        buyer_name: attendanceResponse.name, //펀딩 참여자 이름
        buyer_tel: attendanceResponse.phoneNumber, //펀딩 참여자 핸드폰 번호
        buyer_addr: "서울특별시",
        buyer_postcode: "123-456",
      },
      async (rsp) => {
        try {
          console.log(IMP.request_pay);

          const { data } = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/api/payment-info`,
            {
              paymentInfoUid: rsp.imp_uid, // 결제 고유번호
              attendanceId: attendanceResponse.data.attendanceId,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getCookie("access-token")}`,
              },
            },
          );
          // console.log("rsp data :" + rsp.paid_amount);
          // console.log(JSON.stringify(data.data.response.amount, null, 2));
          // console.log(data.data.response.amount);

          if (rsp.paid_amount === data.data.response.amount) {
            alert("결제 성공");
            navigate("/participate-funding-finish"); // 결제가 성공적으로 이루어진 후 페이지 이동
          } else {
            alert("결제 실패2");
          }
        } catch (error) {
          console.error("Error while verifying payment:", error);
          alert("결제 실패3");
        }
      },
    );
  };

  if (!fundingDetail) {
    return <div>Loading...</div>; // 데이터가 로드되기 전에 로딩 표시
  }

  return (
    <div className="sub-layer flex justify-around pt-20 font-cusFont3">
      <div className="flex  w-[80%] flex-col justify-start">
        <p className=" pb-2 font-cusFont2 text-[20px]">펀딩 참여 정보</p>
        <div
          id="fundingInfo"
          className="flex h-[180px] items-center justify-center rounded-md border border-gray-400 pt-1"
        >
          <div
            id="left"
            className="flex w-[50%] items-center justify-center p-3"
          >
            <img
              src={fundingDetail.productImage}
              alt=""
              className="rounded-md"
            />
          </div>
          <div
            id="right"
            className="m-2 flex w-[50%] flex-col items-start justify-start text-xs"
          >
            <p className="pb-1">펀딩명 : {fundingDetail.title}</p>
            <p className="pb-1">상품명 : {fundingDetail.productName}</p>
            <p className="pb-4">수령자 : {fundingDetail.consumerName}</p>

            <p className="pb-1">{sendMessageTitle}</p>

            <p className="pb-1">{sendMessage}</p>
          </div>
        </div>
      </div>

      <div className="w-[80%] pb-10">
        <p className="pt-4 font-cusFont2 text-[20px]">총 결제 예정 금액</p>
        <p className="font-cusFont2 text-[35px] text-cusColor3">
          {Number(price).toLocaleString()} 원
        </p>
      </div>
      <button
        onClick={handlePayment}
        className="fixed bottom-5  h-[45px] w-[80%]  rounded-md bg-cusColor3 text-white"
      >
        결제하기
      </button>
    </div>
  );
}

export default Paypage;
