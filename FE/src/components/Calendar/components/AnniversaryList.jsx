const AnniversaryList = () => {
  return (
    <>
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
    </>
  );
};

export default AnniversaryList;
