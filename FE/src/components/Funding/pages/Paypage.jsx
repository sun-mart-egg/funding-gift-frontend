import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAttendanceStore from "../../Store/AttendanceStore";
import { getCookie } from "../../../@common/cookies";

//API
import { createAttendance } from "../api/AttendanceAPI";
import { getDetailFunding } from "../../../services/Funding/fundings";

function Paypage() {
  const navigate = useNavigate(); // useNavigate 훅을 사용합니다.
  const [fundingDetail, setFundingDetail] = useState(null);
  const { sendMessage, sendMessageTitle, price, fundingId } =
    useAttendanceStore();
  const [attendanceResponse, setAttendanceResponse] = useState(); //참여 정보
  const [isAttendanceReady, setIsAttendanceReady] = useState(false); // 상태 저장 완료 여부

  useEffect(() => {
    const jquery = document.createElement("script");
    jquery.src = "https://code.jquery.com/jquery-1.12.4.min.js";
    const iamport = document.createElement("script");
    iamport.src = "https://cdn.iamport.kr/js/iamport.payment-1.1.7.js";
    document.head.appendChild(jquery);
    document.head.appendChild(iamport);
    jquery.onload = () => console.log("✅ 아임포트 스크립트 로드 완료");

    return () => {
      document.head.removeChild(jquery);
      document.head.removeChild(iamport);
    };
  }, []);

  // 상태가 완전히 업데이트된 후 결제 실행
  useEffect(() => {
    if (isAttendanceReady && attendanceResponse) {
      console.log("✅ 상태 업데이트 완료. 결제 요청 시작.");
      console.log("✅ merchant_uid 확인:", attendanceResponse.attendanceId);
      console.log("정보확인", attendanceResponse.attendeeName);
      requestPay(attendanceResponse);
      setIsAttendanceReady(false); // 한 번 실행 후 리셋
    }
  }, [attendanceResponse, isAttendanceReady]);

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

  //결제 버튼을 클릭했을때 동작
  const handlePayment = async () => {
    try {
      //참여 정보 생성
      const response = await createAttendance(
        getCookie("access-token"),
        fundingId,
        sendMessage,
        sendMessageTitle,
        price,
      );
      // 상태 저장 후 완료 플래그 설정
      console.log("참여 후 정보 잘 받아왔나? : " + response.data.fundingName);
      setAttendanceResponse(response.data);
      setIsAttendanceReady(true); // 상태 업데이트 완료 여부 설정
      console.log("참여자 정보 생성 완료: ", response);
    } catch (error) {
      console.error("결제 중 오류가 발생했습니다: ", error);
    }
  };

  //결제 요청
  const requestPay = (attendanceData) => {
    console.log("✅ requestPay 함수 실행됨");

    //참석 자료가 있으면 console에 찍어보기
    if (!attendanceData) {
      console.error("❌ 결제 요청 중 attendanceData가 없음");
      return;
    }
    const { IMP } = window;
    if (!IMP) {
      alert(
        "❌ IMP 객체가 존재하지 않음. 아임포트 스크립트가 정상적으로 로드되었는지 확인",
      );
      return;
    }

    IMP.init("imp40448376"); //정상 IMP
    // IMP.init("imp40441376"); //잘못된 IMP

    //아임포트 결제창을 띄움
    IMP.request_pay(
      {
        pg: "html5_inicis.INIpayTest",
        pay_method: "card",
        merchant_uid: attendanceResponse.attendanceId, //참여 번호 -> 다 달라야 함. 고유해야함.
        name: attendanceResponse.fundingName, //펀딩 이름
        amount: attendanceResponse.price, //펀딩 참여 가격
        buyer_email: attendanceResponse.email, //펌딩참여자 이메일
        buyer_name: attendanceResponse.attendeeName, //펀딩 참여자 이름
        buyer_tel: attendanceResponse.phoneNumber, //펀딩 참여자 핸드폰 번호
        buyer_addr: "서울특별시",
        buyer_postcode: "123-456",
      },
      (rsp) => {
        console.log("✅결제 응답 수신 : ", rsp); // 결제 응답 확인

        // 결제 실패 시
        if (!rsp) {
          alert("❌ 결제 실패: ", rsp.error_msg);
          console.log("❌ 결제 실패: ", rsp.error_msg);

          return;
        }

        try {
          const { data } = axios.post(
            `${import.meta.env.VITE_BASE_URL}/api/payment-info`,
            {
              paymentInfoUid: rsp.imp_uid, // 결제 고유번호
              attendanceId: attendanceResponse.attendanceId,
              merchant_uid: attendanceResponse.attendanceId,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getCookie("access-token")}`,
              },
            },
          );
          console.log("rsp data :" + rsp.paid_amount);
          console.log(JSON.stringify(data.data.response.amount, null, 2));
          console.log(data.data.response.amount);

          if (rsp.paid_amount === data.data.response.amount) {
            alert("결제 성공");
            navigate("/participate-funding-finish"); // 결제가 성공적으로 이루어진 후 페이지 이동
          } else {
            alert("결제 실패2");
            navigate("/");
          }
        } catch (error) {
          console.error("Error while verifying payment:", error);
          alert("결제 실패3");
          navigate("/");
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

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import useAttendanceStore from "../../Store/AttendanceStore";
// import { getCookie } from "../../../@common/cookies";

// //API
// import { createAttendance } from "../api/AttendanceAPI";

// // import { fetchDetailFunding } from "../api/FundingAPI";
// import { getDetailFunding } from "../../../services/Funding/fundings";

// function Paypage() {
//   const navigate = useNavigate(); // useNavigate 훅을 사용합니다.
//   const [fundingDetail, setFundingDetail] = useState(null);
//   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
//   const { sendMessage, sendMessageTitle, price, fundingId } =
//     useAttendanceStore();

//   // 결제 수단을 선택하는 함수입니다.
//   const selectPaymentMethod = (method) => {
//     setSelectedPaymentMethod(method);
//   };

//   const [attendanceResponse, setAttendanceResponse] = useState();

//   useEffect(() => {
//     const jquery = document.createElement("script");
//     jquery.src = "https://code.jquery.com/jquery-1.12.4.min.js";
//     const iamport = document.createElement("script");
//     iamport.src = "https://cdn.iamport.kr/js/iamport.payment-1.1.7.js";
//     document.head.appendChild(jquery);
//     document.head.appendChild(iamport);
//     return () => {
//       document.head.removeChild(jquery);
//       document.head.removeChild(iamport);
//     };
//   }, []);

//   useEffect(() => {
//     console.log("펀딩 id : + " + fundingId);
//     const token = getCookie("access-token");
//     if (token && fundingId) {
//       console.log(`Fetching funding details for ID: ${fundingId}`);

//       getDetailFunding(fundingId)
//         .then((response) => {
//           console.log("Funding details fetched successfully.");
//           setFundingDetail(response);
//         })
//         .catch((error) => {
//           console.error("Error fetching funding details:", error);
//         });
//     }
//   }, [fundingId]);

//   if (!fundingDetail) {
//     return <div>Loading...</div>; // 데이터가 로드되기 전에 로딩 표시
//   }

//   const handlePayment = async () => {
//     try {
//       const response = await createAttendance(
//         localStorage.getItem("access-token"),
//         fundingId,
//         sendMessage,
//         sendMessageTitle,
//         price,
//       );
//       console.log("참여 후 정보 잘 받아왔나? : " + response.data.fundingName);
//       setAttendanceResponse(response);
//       if (attendanceResponse) {
//         // console.log(attendanceResponse.data.fundingName);
//         requestPay();
//       } else {
//         console.error("참여 정보를 받지 못했습니다.");
//       }
//     } catch (error) {
//       console.error("결제 중 오류가 발생했습니다: ", error);
//     }
//   };

//   const requestPay = () => {
//     // console.log("참여 번호 확인 :" + attendanceResponse.data.attendanceId);
//     // console.log("펀딩 이름 확인 :" + attendanceResponse.data.fundingName);
//     // console.log("참여가격 확인 :" + attendanceResponse.data.price);
//     // console.log("참여자 이메일 확인 :" + attendanceResponse.data.email);
//     // console.log("참여자 이름 확인 :" + attendanceResponse.data.attendeeName);
//     // console.log("참여자 번호 확인 :" + attendanceResponse.data.phoneNumber);

//     const { IMP } = window;
//     IMP.init("imp40448376");

//     IMP.request_pay(
//       {
//         pg: "html5_inicis.INIpayTest",
//         pay_method: "card",
//         merchant_uid: attendanceResponse.data.attendanceId,
//         name: attendanceResponse.data.fundingName,
//         amount: attendanceResponse.data.price,
//         buyer_email: attendanceResponse.data.email,
//         buyer_name: attendanceResponse.data.attendeeName,
//         buyer_tel: attendanceResponse.data.phoneNumber,
//         buyer_addr: "서울특별시",
//         buyer_postcode: "123-456",
//       },
//       async (rsp) => {
//         try {
//           const { data } = await axios.post(
//             `${import.meta.env.VITE_BASE_URL}/api/payment-info`,
//             {
//               paymentInfoUid: rsp.imp_uid, // 결제 고유번호
//               attendanceId: attendanceResponse.data.attendanceId,
//             },
//             {
//               headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${localStorage.getItem("access-token")}`,
//               },
//             },
//           );
//           // console.log("rsp data :" + rsp.paid_amount);
//           // console.log(JSON.stringify(data.data.response.amount, null, 2));
//           // console.log(data.data.response.amount);

//           if (rsp.paid_amount === data.data.response.amount) {
//             alert("결제 성공");
//             navigate("/participate-funding-finish"); // 결제가 성공적으로 이루어진 후 페이지 이동
//           } else {
//             alert("결제 실패2");
//           }
//         } catch (error) {
//           console.error("Error while verifying payment:", error);
//           alert("결제 실패3");
//         }
//       },
//     );
//   };

//   if (!fundingDetail) {
//     return <div>Loading...</div>; // 데이터가 로드되기 전에 로딩 표시
//   }

//   return (
//     <div className="sub-layer flex justify-around pt-20 font-cusFont3">
//       <div className="flex  w-[80%] flex-col justify-start">
//         <p className=" pb-2 font-cusFont2 text-[20px]">펀딩 참여 정보</p>
//         <div
//           id="fundingInfo"
//           className="flex h-[180px] items-center justify-center rounded-md border border-gray-400 pt-1"
//         >
//           <div
//             id="left"
//             className="flex w-[50%] items-center justify-center p-3"
//           >
//             <img
//               src={fundingDetail.productImage}
//               alt=""
//               className="rounded-md"
//             />
//           </div>
//           <div
//             id="right"
//             className="m-2 flex w-[50%] flex-col items-start justify-start text-xs"
//           >
//             <p className="pb-1">펀딩명 : {fundingDetail.title}</p>
//             <p className="pb-1">상품명 : {fundingDetail.productName}</p>
//             <p className="pb-4">수령자 : {fundingDetail.consumerName}</p>

//             <p className="pb-1">{sendMessageTitle}</p>

//             <p className="pb-1">{sendMessage}</p>
//           </div>
//         </div>
//       </div>

//       <div className="w-[80%] pb-10">
//         <p className="pt-4 font-cusFont2 text-[20px]">총 결제 예정 금액</p>
//         <p className="font-cusFont2 text-[35px] text-cusColor3">
//           {Number(price).toLocaleString()} 원
//         </p>
//       </div>
//       <button
//         onClick={handlePayment}
//         className="fixed bottom-5  h-[45px] w-[80%]  rounded-md bg-cusColor3 text-white"
//       >
//         결제하기
//       </button>
//     </div>
//   );
// }

// export default Paypage;
