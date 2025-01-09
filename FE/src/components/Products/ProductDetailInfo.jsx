import Star from "/imgs/star.png";

const ProductDetailInfo = ({ product, selectedOption, selectedToggleVisible, onOptionChange, onToggleVisible, formattedPrice}) => {
  return (
    <>
      {/* 이미지 들어갈 영역 */}
      <div className="mt-[30px] flex h-[400px] w-[100%] justify-center border-b-[2px] border-b-cusColor3">
        <img src={product.imageUrl} alt="" className="max-h-full max-w-full" />
      </div>

      {/* 이미지 하단 영역 */}
      {/* 상품 정보 */}

      {/* 상품 명 */}
      <p className="mb-[20px] text-lg text-black">{product.productName}</p>

      {/* 옵션 선택 */}
      <div className="relative mb-[10px]">
        <button
          onClick={() => onToggleVisible(!selectedToggleVisible)}
          className="rounded-xl border border-cusColor3 p-2"
        >
          선택된 옵션:{" "}
          {selectedOption
            ? product.options.find((option) => option.id === selectedOption)
                ?.name
            : "옵션 선택 안 함"}
        </button>

        {selectedToggleVisible && (
          <div className="absolute left-0 z-10 mt-1 w-52 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div
              className="py-1"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              {product.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => onOptionChange(option.id)}
                  className={`${selectedOption === option.id ? "bg-cusColor3 text-white" : ""} block w-full px-4 py-2 text-left text-sm`}
                >
                  {option.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 별점 정보 */}
      <div className="mb-[5px] flex">
        <img src={Star} alt="" className="aspect-auto w-[4%] object-contain" />
        <span className="text-base-bold ml-1">{product.reviewAvg}</span>
      </div>

      {/* 가격 정보 */}
      <div className="text-base-bold">{formattedPrice(product.price)}원</div>

      {/* 상품 정보 */}
      <p className="text-bold mb-[5px] mt-[10px] h-[100px] w-full rounded-xl border-[1.5px] border-cusColor3 p-3 text-sm">
        {product.description}
      </p>
    </>
  );
};

export default ProductDetailInfo;
