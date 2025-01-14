import UpArrow from "/imgs/up-arrow.png";

const ScrollUpButton = ({ bottom }) => {
  const handleScrollUp = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={handleScrollUp}
      className={`fixed right-5 h-[40px] w-[40px] rounded-full`}
      style={{ bottom: `${bottom}px` }}
    >
      <img src={UpArrow} alt="" className="h-[100%] w-[100%]" />
    </button>
  );
};

export default ScrollUpButton;
