import { Link } from "react-router-dom";
import { getCookie } from "../../@common/cookies";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  const navigateHandle = (path) => {
    console.log("handel navigate");
    if (getCookie("access-token")) {
      if (path === "wishlist") navigate("/wishlist");
      if (path === "calendar") navigate("calendar");
    } else {
      navigate("/login-page");
    }
  };
  return (
    <header className="header w-full justify-between">
      <Link to={"/"}>
        <img src="/imgs/logo.png" alt="logo" />
      </Link>

      <header className="flex flex-row gap-3 p-3">
        <button onClick={() => navigateHandle("wishlist")}>
          <img src="/imgs/heart.png" alt="wish-button" />
        </button>
        <button onClick={() => navigateHandle("calendar")}>
          <img src="/imgs/calendar.png" alt="calendar-button" />
        </button>
      </header>
    </header>
  );
}

export default Header;
