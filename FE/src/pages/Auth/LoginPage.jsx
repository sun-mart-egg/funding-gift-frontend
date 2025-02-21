import LoginLogo from "/imgs/loginLogo.png";
import KakaoLogin from "/imgs/kakaoLogin.png";

function Login() {
  const REACT_APP_KAKAO_URL = import.meta.env.VITE_KAKAO_LOGIN;

  const kakaoLoginHandler = () => {
    // window.location.href = process.env.REACT_APP_KAKAO_URL;
    window.location.replace(REACT_APP_KAKAO_URL);
  };

  return (
    <div className="sub-layer">
      <img src={LoginLogo} alt="login" />
      <p className="signup-font m-5">소셜 계정으로 편리햐게 로그인 해보세요!</p>
      <button onClick={kakaoLoginHandler}>
        <img src={KakaoLogin} alt="login" className=" mt-7" />
      </button>
    </div>
  );
}

export default Login;
