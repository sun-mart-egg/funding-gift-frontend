import { useNavigate } from "react-router-dom";

const AnniversaryList = ({ selectedEvents, selectedDay }) => {
  const navigate = useNavigate();

  return (
    <div className="signup-font absolute bottom-0 z-10 flex h-full max-h-[205px] w-full flex-col gap-4 overflow-y-scroll border-t-2 bg-white p-3 text-2xl">
      {selectedDay}
      {/* 선택한 날짜에 대한 기념일 목록 출력 */}
      {selectedEvents.length > 0 ? (
        selectedEvents.map((event, index) => (
          <div
            key={index}
            onClick={() =>
              navigate(`/friend-funding-detail/${event.fundingId}`)
            }
          >
            <p>
              😘 {event.name}의 {event.title}
            </p>
          </div>
        ))
      ) : (
        <div>
          <p>기념일이 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default AnniversaryList;
