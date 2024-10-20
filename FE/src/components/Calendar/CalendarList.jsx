import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { forwardRef } from "react";

const CalendarList = forwardRef((
  { events, handleDateClick, handleCurDate, handleClickToday },
  ref,
) => {

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

  return (
    <div className="absolute top-[65px] w-full">
      <FullCalendar
        ref={ref}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
        locale="kr"
        headerToolbar={{
          left: "prev",
          center: "title",
          right: "today next",
        }}
        customButtons={{
          today: {
            text: KoreaTime().split("-")[2], // 오늘 날짜를 today 글자 대신 표현
            click: handleClickToday,
          },
        }}
        datesSet={handleCurDate}
        eventContent={() => {
          return "";
        }}
        eventBackgroundColor="#FD7676"
        showNonCurrentDates={false}
      />
    </div>
  );
});

export default CalendarList;
