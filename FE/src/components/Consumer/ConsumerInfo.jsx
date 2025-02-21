import { AiFillCamera } from "react-icons/ai";
import { IoLogOut } from "react-icons/io5";

const ConsumerInfo = ({
  isEditMode,
  userInfo,
  editName,
  defaultAddress,
  sortConsumerAddr,
  handleNameChange,
  handleAddrChange,
  checkMyFunding,
  handleEditClick,
  setIsEditMode,
  handleLogOut,
}) => {
  return (
    <div className="sub-layer font-cusFont3">
      {/* 소비자 사진, 이름 영역 */}
      <div className="head absolute top-20 flex w-full items-center px-6">
        {/* 프로필 사진 */}
        <div className="relative mr-4 ">
          <img
            src={userInfo.profileImageUrl}
            alt=""
            className=" h-[80px] w-[80px] rounded-full"
          />

          {isEditMode && (
            <AiFillCamera
              className="absolute bottom-0 right-1 text-[20px] text-[#9B9B9B]"
              style={{ bottom: "-10px", right: "1px" }}
            />
          )}
        </div>
        {/* 이름 */}
        {/* 수정모드일 경우 변경할 이름 입력할 input 태그 활성화 */}
        {/* 수정모드가 아닌 경우 기존 이름과 로그아웃 버튼 출력 */}
        <div className="flex w-[70%] justify-between">
          {isEditMode ? (
            <input
              type="text"
              value={editName || ""}
              onChange={handleNameChange}
              placeholder={userInfo.name}
              className="mr-1 w-full rounded-md border border-gray-400 px-2 font-cusFont5 text-[25px]"
            />
          ) : (
            <>
              <p className="mr-1 px-2 font-cusFont5 text-[25px]">
                {userInfo.name}
              </p>
              <button
                className="flex flex-col items-center justify-center"
                onClick={handleLogOut}
              >
                <IoLogOut className="text-[25px]" />
                <p className="text-[10px]">로그아웃</p>
              </button>
            </>
          )}
        </div>
      </div>

      {/* 소비자 생일, 주소, 계좌번호 영역 */}
      <div className="content absolute top-52 w-full px-6 font-cusFont3">
        {/* 생일 */}
        <section id="birthday">
          <div className="sub-title">
            <p>생일</p>
          </div>
          <div className="sub-content">
            <p
              className={`mr-1 w-full rounded-md p-3 px-2 font-cusFont3 text-[14px] ${isEditMode ? "border border-gray-400" : "bg-[#EFEFEF]"}`}
            >
              {userInfo.birthyear}-{String(userInfo.birthday).slice(0, 2)}-
              {String(userInfo.birthday).slice(2)}
            </p>
          </div>
        </section>

        {/* 주소 */}
        {/* 수정모드일 경우 소비자의 주소목록 전체를 볼 수 있는 select 출력 */}
        {/* 수정모드가 아닌 경우 소비자의 기본 배송지 출력 */}
        <section id="address">
          <div className="sub-title pt-6 ">
            <p>기본 주소</p>
            {isEditMode && (
              <button className="w-[25%] rounded-md bg-[#9B9B9B] text-[12px] text-white">
                기본 주소 선택
              </button>
            )}
          </div>
          {isEditMode ? (
            <select
              className="mr-1 w-full rounded-md border border-gray-400 p-3 px-2 font-cusFont3 text-[14px]"
              onChange={handleAddrChange}
            >
              {sortConsumerAddr.map((address) => (
                <option value={address.id} key={address.id}>
                  {address.defaultAddr} {address.detailAddr} / {address.zipCode}
                </option>
              ))}
            </select>
          ) : (
            <p className="mr-1 w-full rounded-md bg-[#EFEFEF] p-3 px-2 font-cusFont3 text-[14px]">
              {defaultAddress
                ? `${defaultAddress.defaultAddr} ${defaultAddress.detailAddr} / ${defaultAddress.zipCode}`
                : "설정된 기본주소가 없습니다."}
            </p>
          )}
        </section>

        {/* 계좌 */}
        <div id="account">
          <div className="sub-title pt-6">
            <p>기본 계좌</p>
            {isEditMode && (
              <button className="w-[25%] rounded-md bg-[#9B9B9B] text-[12px] text-white">
                기본 계좌 선택
              </button>
            )}
          </div>
          <p
            className={`mr-1 w-full rounded-md p-3 px-2 font-cusFont3 text-[14px] ${isEditMode ? "border border-gray-400" : "bg-[#EFEFEF]"}`}
          >
            ⚠ 계좌정보를 추가해야 합니다. ⚠
          </p>
        </div>
      </div>

      {/* 수정모드일 경우 수정 완료, 취소, 회원탈퇴 노출 */}
      {/* 수정모드가 아닐 경우 수정 하기 노출 */}
      {isEditMode ? (
        <>
          <button
            className="absolute bottom-16 right-[15%] pb-3 text-[12px] text-gray-300"
            onClick={checkMyFunding}
          >
            회원 탈퇴
          </button>
          <div
            id="buttonSection"
            className="absolute bottom-0 flex w-full flex-row items-center justify-around gap-2 p-5"
          >
            <button
              onClick={handleEditClick}
              style={{ width: "calc(75% )" }} // 버튼 너비 조정
              className="common-btn"
            >
              수정 완료
            </button>
            <button
              onClick={() => setIsEditMode(false)}
              style={{ width: "calc(75% )" }} // 버튼 너비 조정
              className="common-btn"
            >
              취소
            </button>
          </div>
        </>
      ) : (
        <div
          id="buttonSection"
          className="absolute bottom-0 flex w-full flex-col items-center justify-around pb-5"
        >
          <button
            onClick={handleEditClick}
            style={{ width: "calc(75% )" }} // 버튼 너비 조정
            className="common-btn"
          >
            수정 하기
          </button>
        </div>
      )}
    </div>
  );
};

export default ConsumerInfo;
