import { useState, useEffect, useRef, useCallback } from "react";
import SearchBar from "../UI/SearchBar";
import { useNavigate } from "react-router-dom";

import CatIcon from "/imgs/cat.PNG";
import FishIcon from "/imgs/fish.PNG";
import BannerImage1 from "/imgs/banner_image1.png";
import BannerImage2 from "/imgs/banner_image2.png";
import BannerImage3 from "/imgs/banner_image3.png";

import HomeProduct from "./HomeProduct";
import ScrollToTop from "../UI/ScrollToTop";

import { initializeApp } from "firebase/app";
import { getMessaging, onMessage } from "firebase/messaging";

// iOS 카카오톡 인앱 브라우저 확인 함수
function isIOSKakaoInAppBrowser() {
  const userAgent = navigator.userAgent;
  return /iPhone|iPad/.test(userAgent) && /KAKAOTALK/.test(userAgent);
}

function Home() {
  const observer = useRef();
  const navigate = useNavigate();

  const [currentBanner, setCurrentBanner] = useState(0);
  const bannerImages = [BannerImage1, BannerImage2, BannerImage3];

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // iOS 카카오톡 브라우저에서는 Firebase 초기화하지 않음
  let firebaseApp, messaging;
  if (!isIOSKakaoInAppBrowser()) {
    const firebaseConfig = {
      apiKey: "AIzaSyBE1OaWA2Bo3bxh-8oUfJCKGGFz6DkNYbA",
      authDomain: "funding-gift.firebaseapp.com",
      projectId: "funding-gift",
      storageBucket: "funding-gift.appspot.com",
      messagingSenderId: "184194517827",
      appId: "1:184194517827:web:f2a715c4f6c082503afdf6",
      measurementId: "G-GPCQJX1FSL",
    };

    firebaseApp = initializeApp(firebaseConfig);
    messaging = getMessaging(firebaseApp);
  }

  // 알림 권한 요청
  useEffect(() => {
    if (isIOSKakaoInAppBrowser()) {
      console.warn("iOS 카카오톡 브라우저에서는 알림이 지원되지 않습니다.");
      alert("iOS 카카오톡 브라우저에서는 알림 기능이 지원되지 않습니다. 다른 브라우저를 이용해 주세요.");
    } else if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted.");
        } else {
          console.log("Notification permission not granted.");
        }
      });
    } else {
      console.warn("이 브라우저는 알림 기능을 지원하지 않습니다.");
      alert("이 브라우저는 알림 기능을 지원하지 않습니다.");
    }
  }, []);

  // FCM 알림 수신 설정
  useEffect(() => {
    if (!isIOSKakaoInAppBrowser() && "Notification" in window && messaging) {
      onMessage(messaging, (payload) => {
        console.log("Message received. ", payload);
        alert(payload.notification.body);
      });
    }
  }, [messaging]);

  const lastProductElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  const loadProducts = async (page) => {
    setLoading(true);
    try {
      const response = await fetch(
        import.meta.env.VITE_BASE_URL +
          `/api/products/rank?page=${page}&size=10`,
      );
      const json = await response.json();
      if (json.code === 200 && json.data) {
        setProducts((prevProducts) => {
          const newData = json.data.data.filter(
            (newItem) =>
              !prevProducts.some(
                (prevItem) => prevItem.productId === newItem.productId,
              ),
          );
          return [...prevProducts, ...newData];
        });
        setHasMore(json.data.hasNext === true);
      } else {
        console.error("Error fetching products:", json.msg);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProducts(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="main-layer font-cusFont2">
      <div className="w-full">
        <SearchBar />
      </div>

      <div className="relative mt-5 h-[150px] w-[95%] overflow-hidden rounded-md">
        {bannerImages.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Banner ${index + 1}`}
            className={`absolute left-0 top-0 h-full w-full rounded-lg object-cover transition-opacity duration-1000 ${index === currentBanner ? "opacity-100" : "opacity-0"}`}
          />
        ))}
      </div>

      <div className="flex w-[95%]">
        <div
          onClick={() => navigate("/make-funding-main")}
          className="relative mr-[1.5%] mt-[15px] h-[100px] w-[50%] rounded-md bg-cusColor4 p-5 text-center"
        >
          <img
            src={CatIcon}
            alt=""
            className="absolute left-1/2 top-[5%] h-[70.5px] w-[68px] -translate-x-1/2 transform"
          />
          <p className="absolute bottom-2 left-0 right-0 w-full text-xs">
            펀딩 만들러 가기
          </p>
        </div>
        <div
          onClick={() => navigate("/funding")}
          className="relative ml-[1.5%] mt-[15px] h-[100px] w-[50%] rounded-md bg-cusColor3 p-5 text-center"
        >
          <img
            src={FishIcon}
            alt=""
            className="absolute left-1/2 top-[5%] h-[71px] w-[92px] -translate-x-1/2 transform"
          />
          <p className="absolute bottom-2 left-0 right-0 w-full text-xs">
            펀딩 참여하러 가기
          </p>
        </div>
      </div>

      <div className="ml-[5%] mt-[10px] w-[95%] text-left">
        <p className="mt-[10px] font-cusFont5 text-[30px]">추천 상품</p>
        <div>
          <HomeProduct />
        </div>
      </div>
      <ScrollToTop className="bottom-[25px]" />
    </div>
  );
}

export default Home;
