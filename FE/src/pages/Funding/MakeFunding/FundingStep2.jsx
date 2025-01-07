// FundingStep2.jsx
import DatePicker from "react-datepicker";

function FundingStep2({
  formData,
  handleInputChange,
  handleAnniversaryChange,
  selectedAnniversary,
  renderCategoryDropdown,
  showDatePicker,
  setShowDatePicker,
  refDatePicker, // ref를 부모에서 넘겨받음
  handleDateChange,
  getFormattedDate,
  CustomInput,
}) {
  return (
    <div className="text-md flex flex-col justify-center">
      <div id="card-content">
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

        <div id="funding-date" className="mb-6">
          <div className="flex justify-between">
            <p>펀딩 기간</p>
            <DatePicker
              ref={refDatePicker}
              selected={
                formData.startDate ? new Date(formData.startDate) : null
              }
              onChange={handleDateChange}
              onClickOutside={() => setShowDatePicker(false)}
              open={showDatePicker}
              selectsRange={true}
              startDate={
                formData.startDate ? new Date(formData.startDate) : null
              }
              endDate={formData.endDate ? new Date(formData.endDate) : null}
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
