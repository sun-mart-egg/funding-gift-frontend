const ProductCategoriesBar = ({ categories, isSelected, onSelect}) => {
  return (
    <div className="flex w-[90.5%] justify-center space-x-1">
      {categories.map((category) => (
        <div
          key={category.id}
          className="flex flex-1 flex-col items-center" // flex-1로 각 항목이 유연하게 크기 조정
        >
          <button
            className={`flex h-full w-full items-center justify-center rounded-md p-1 
                ${isSelected === category.id ? "bg-cusColor3" : ""}`}
            onClick={() => onSelect(category.id)}
          >
            <img
              src={category.image}
              alt={category.text}
              className={`h-[90%] w-[90%] 
                    ${isSelected === category.id ? "invert" : ""}`}
            />
          </button>
          <span className="mt-2 text-xs">{category.text}</span>
        </div>
      ))}
    </div>
  );
};

export default ProductCategoriesBar;
