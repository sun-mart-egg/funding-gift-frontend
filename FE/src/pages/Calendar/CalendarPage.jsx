import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query"

// API 호출
import getEventsList from "../../services/Calendar/getEventsList.js";

// 컴포넌트 호출
import AnniversaryList from "../../components/Calendar/AnniversaryList.jsx";
import CalendarList from "../../components/Calendar/CalendarList.jsx";


const CalendarPage = () => {
  const [selectedEvents, setSelectedEvents] = useState([]); // 선택한 날짜에 있는 행사목록
  const [selectedDay, setSelectedDay] = useState(null); // 선택한 날짜에 대한 useState

  // axios 요청을 위한 연도, 월 데이터
  const [curYear, setCurYear] = useState("");
  const [curMonth, setCurMonth] = useState("");
  const { data: events = [] } = useQuery({
    queryKey: ["events", curYear, curMonth],
    queryFn: () => getEventsList(curYear, curMonth),
    enabled: Boolean(curYear && curMonth),
    select: (data) => data.map((item) => ({
      title: item.title,
      date: item.anniversaryDate,
      name: item.consumerName,
      fundingId: item.fundingId,
      display: "background",
    })),
    onError: (error) => (
      console.error("기념일 목록 조회 요청 실패", error)
    )
  });

  // today 버튼 로직을 위한 캘린더 참조 ref
  const calendarRef = useRef(null);

  // 한국 시간으로 변환
  const KoreaTime = () => {
    const koreaTimeFormat = new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "Asia/Seoul",
    });
    const today = new Date();
    const formattedDate = koreaTimeFormat
      .format(today)
      .replace(/\. /g, "-")
      .replace(/\./, "");
    return formattedDate; // 'YYYY-MM-DD' 형태로 반환
  };

  // 풀캘린더에서 날짜 받아서 split한 값을 curYear, curMonth에 할당
  const handleCurDate = (dateInfo) => {
    // 연도와 월의 형식이 2024-04-02로 들어오는데
    // "-"를 기준으로 나눈 후에, 10진수의 정수로 반환한다.
    let year = parseInt(dateInfo.startStr.split("-")[0], 10); // 년도
    let month = parseInt(dateInfo.startStr.split("-")[1], 10); // 월
    let day = parseInt(KoreaTime().split("-")[2], 10); // 일

    console.log(year, month, day);
    setCurYear(year);
    setCurMonth(month);
  };

  // 페이지 접속 시, 오늘 날짜의 이벤트 목록들이 바로 출력되도록 설정
  useEffect(() => {
    if (events.length > 0) {
      const today = KoreaTime(); // 한국 날짜 기준으로 받아오기.
      const todayEvents = events.filter((event) => event.date === today); // 오늘 날짜랑 event의 날짜랑 같은것만 필터링
      setSelectedEvents(todayEvents);
      setSelectedDay(today);
    }
  }, [events]);

  // 캘린더에서 날짜 선택 시
  const handleDateClick = (arg) => {
    const clickedDate = arg.dateStr;
    const ThisDate = events.filter((event) => {event.data === clickedDate});
    setSelectedEvents(ThisDate);
    setSelectedDay(clickedDate);
    console.log(clickedDate);
  };

  // 캘린더 header에서 'today' 버튼 선택 시 오늘 날짜로 focus
  const handleClickToday = () => {
    const calendarApi = calendarRef.current.getApi(); // 풀캘린더 api 인스턴스를 가져온다
    calendarApi.today(); // 캘린더를 오늘 날짜로 이동시킨다

    const today = KoreaTime(); // 한국 시간 반영
    const todayEvents = events.filter((event) => event.date === today); // 오늘 날짜에 해당하는 이벤트 필터링

    setSelectedEvents(todayEvents); // 오늘 날짜 이벤트로 상태 업데이트
    setSelectedDay(today); // 오늘 날짜로 상태 업데이트
  };

  return (
    <div className="sub-layer">
      <CalendarList
        ref={calendarRef}
        events={events}
        handleDateClick={handleDateClick}
        handleCurDate={handleCurDate}
        handleClickToday={handleClickToday}
      />
      <AnniversaryList
        selectedEvents={selectedEvents}
        selectedDay={selectedDay}
      />
    </div>
  );
};

export default CalendarPage;
