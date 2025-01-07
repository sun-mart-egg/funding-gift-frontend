// FundingStep1.jsx

function FundingStep1({ formData, handleInputChange }) {
  return (
    <div className="text-md flex flex-col justify-center">
      <div id="card-content">
        <div id="is-isPrivate" className="mb-6 flex">
          <p className="mr-4">친한친구에게만 공개하기</p>
          <input
            type="checkbox"
            name="isPrivate"
            checked={formData.isPrivate || false}
            onChange={handleInputChange}
            className="p-4"
          />
        </div>

        <div id="funding-title" className="mb-6">
          <p>펀딩 제목</p>
          <input
            type="text"
            name="title"
            value={formData.title || ""}
            placeholder="펀딩 제목을 입력해 주세요."
            onChange={handleInputChange}
            className="mt-2 h-7 w-full rounded-md border border-gray-400 p-2 text-xs placeholder:text-xs"
          />
        </div>

        <div id="funding-detail">
          <p>펀딩 소개</p>
          <textarea
            name="content"
            value={formData.content || ""}
            onChange={handleInputChange}
            placeholder="펀딩에 대해 소개해 주세요."
            className="mt-2 w-full rounded-md border border-gray-400 p-2 text-xs placeholder:text-xs"
          />
        </div>
      </div>
    </div>
  );
}

export default FundingStep1;
