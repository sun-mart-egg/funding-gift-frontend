import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const Calendarr = () => {
  return (
    <>
      <FullCalendar
        ref={calendarRef}
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
    </>
  );
};

export default Calendarr;