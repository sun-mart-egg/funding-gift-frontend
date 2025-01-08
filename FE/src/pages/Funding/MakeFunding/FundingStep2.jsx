import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function FundingStep2({
  formData,
  handleInputChange,
  handleAnniversaryChange,
  selectedAnniversary,
  renderCategoryDropdown,
  showDatePicker,
  setShowDatePicker,
  refDatePicker,
  handleDateChange, // 배열 형태의 dates를 받아서 formData에 반영하는 함수
  getFormattedDate,
  CustomInput,
}) {
  return (
    <div className="text-md flex flex-col justify-center">
      <div id="card-content">
        {/* 기념일 선택 섹션 */}
        <div id="anniversaryDate" className="mb-6">
          <div className="flex-col justify-between">
            <p>기념일</p>
            {renderCategoryDropdown()}
            <input
              type="date"
              name="anniversaryDate"
              value={formData.anniversaryDate || ""}
              onChange={handleAnniversaryChange}
              className="mt-1 h-8 w-full rounded-md border border-[#9B9B9B] px-2 text-xs focus:border-cusColor3 focus:outline-none"
            />
          </div>

          <div className="mt-2 text-xs">
            {selectedAnniversary && (
              <div>
                <div className="flex">
                  <p className="mb-1 mr-1">{selectedAnniversary.name}</p>
                  <p>{selectedAnniversary.anniversaryName}</p>
                </div>
                <p>{selectedAnniversary.anniversaryDate}</p>
              </div>
            )}
          </div>
        </div>

        {/* 펀딩 기간 선택 섹션 */}
        <div id="funding-date" className="mb-6">
          <div className="flex justify-between">
            <p>펀딩 기간</p>
            <DatePicker
              ref={refDatePicker}
              // 달력 열고 닫기는 부모 상태 showDatePicker로 제어
              open={showDatePicker}
              onClickOutside={() => setShowDatePicker(false)}
              // 날짜 범위 선택 모드
              selectsRange={true}
              // 시작/종료 날짜
              startDate={
                formData.startDate ? new Date(formData.startDate) : null
              }
              endDate={formData.endDate ? new Date(formData.endDate) : null}
              // 날짜가 바뀔 때마다 handleDateChange로 formData에 반영
              onChange={handleDateChange}
              dateFormat="yyyy/MM/dd"
              customInput={<CustomInput />}
              className="p-2"
            />
          </div>

          <div className="mt-2 flex w-full justify-between rounded-md border border-gray-400">
            <p className="w-[80%] p-2 text-xs">
              {formData.startDate && formData.endDate
                ? `${getFormattedDate(formData.startDate)} ~ ${getFormattedDate(
                    formData.endDate,
                  )}`
                : "기간을 입력하세요"}
            </p>
          </div>
        </div>

        {/* 최소금액 입력 */}
        <div className="mb-6">
          <p>최소금액</p>
          <input
            type="number"
            name="minPrice"
            value={formData.minPrice || ""}
            placeholder="최소 금액을 입력해주세요."
            className="mt-2 h-8 w-full rounded-md border border-gray-400 p-2 text-xs placeholder:text-xs"
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
}

export default FundingStep2;
