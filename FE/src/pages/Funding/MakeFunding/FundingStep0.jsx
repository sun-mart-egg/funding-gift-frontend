/* eslint-disable react/prop-types */
// FundingStep0.jsx

function FundingStep0({ product }) {
  if (!product) {
    return <div>상품 정보를 불러오는 중...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center text-center font-cusFont3">
      <div
        id="imgSection"
        className="mb-8 flex w-2/3 items-center justify-center text-center"
      >
        <img src={product.imageUrl} alt="" className="w-24" />
      </div>
      <div id="itemInfo">
        <p className="p-2 font-cusFont2 text-xl">{product.productName}</p>
        <p className="p-2 font-cusFont2 text-xl">{product.productOptionId}</p>
        <p>{product.price} 원</p>
        <p className="pt-2"> 선물은 만들어 볼까요?</p>
      </div>
    </div>
  );
}

export default FundingStep0;
