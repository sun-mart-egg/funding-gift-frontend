// FundingStep3.jsx

function FundingStep3({ selectedAddress, selectedAccount, navigate }) {
  return (
    <div className="text-md flex flex-col justify-center">
      <div id="card-content">
        <div id="address" className="mb-6">
          <div className="flex justify-between">
            <p>주소</p>
            <button
              className="common-btn h-6 bg-gray-500 text-xs"
              onClick={() => navigate("/address-list")}
            >
              선택
            </button>
          </div>
          <div className="mt-4 h-[80px] rounded-md border border-gray-400 text-xs">
            {selectedAddress == null ? (
              "주소를 선택해 주세요"
            ) : (
              <div>
                <div className="flex">
                  <p className="mb-1 mr-1">{selectedAddress.name}</p>
                  <p>{selectedAddress.nickname}</p>
                </div>
                <p>{selectedAddress.phoneNumber}</p>
                <div className="flex">
                  <p className="mr-1">{selectedAddress.defaultAddr}</p>
                  <p className="mr-1">{selectedAddress.detailAddr}</p>
                  <p className="mr-1">{selectedAddress.zipCode}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div id="account">
          <div className="flex justify-between">
            <p>환불 계좌</p>
            <button
              className="common-btn h-6 bg-gray-500 text-xs"
              onClick={() => navigate("/account-list")}
            >
              선택
            </button>
          </div>
          <div className="mt-4 h-[50px] rounded-md border border-gray-400 text-xs">
            {selectedAccount == null ? (
              "계좌를 선택해 주세요"
            ) : (
              <div>
                <p>{selectedAccount.name}</p>
                <div className="flex">
                  <p className="mb-1 mr-1">{selectedAccount.accountBank}</p>
                  <p>{selectedAccount.accountNo}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FundingStep3;
