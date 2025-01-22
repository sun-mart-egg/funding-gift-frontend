import Cookies from "universal-cookie";

const cookies = new Cookies();

// 쿠키 설정
export const setCookie = (name, value, option) => {
  return cookies.set(name, value, {
    ...option,
    path: "/",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 3), // 토큰 유효기간 3시간
  });
};

// 쿠키 호출
export const getCookie = (name, option) => {
  return cookies.get(name, { ...option });
};

// 쿠키 제거
export const removeCookie = (name, option) => {
  return cookies.remove(name, {...option,
    path: "/",
  });
};

// 모든 쿠키 제거
// 로그아웃, 브라우저 종료 시 사용
export const removeAllCookie = () => {
  const allCookies = cookies.getAll();
  Object.keys(allCookies).forEach((cookieName) => {
    cookies.remove(cookieName, { path: "/" });
  });
};