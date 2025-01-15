// FundingStep4.jsx

function FundingStep4({ product, formData, getFormattedDate }) {
  console.log(formData);

  if (!product) {
    return <div>상품 정보 불러오는 중...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center text-[12px]">
      <img src={product.imageUrl} alt="" className="mb-4 w-[50%]" />
      <p className="mb-1">{product.productName}</p>
      <p className="mb-1">
        {formData.isPrivate ? "친한 친구에게만 공개하기" : "모두에게 공개하기"}
      </p>
      <p className="mb-1">{formData.title}</p>
      <p className="mb-1">{formData.content}</p>
      <p className="mb-1">{formData.anniversaryDate}</p>
      <p className="mb-1">
        {getFormattedDate(formData.startDate)} ~{" "}
        {getFormattedDate(formData.endDate)}
      </p>
      <p className="mb-1">{formData.minPrice}</p>

      <div className="mb-1 flex">
        <p className="mr-1">{formData.defaultAddr} </p>
        <p className="mr-1">{formData.detailAddr} </p>
        <p className="mr-1">{formData.zipCode} </p>
      </div>
      <p className="mb-1">{formData.accountBank}</p>
      <p className="mb-1">{formData.accountNo}</p>
    </div>
  );
}

export default FundingStep4;
