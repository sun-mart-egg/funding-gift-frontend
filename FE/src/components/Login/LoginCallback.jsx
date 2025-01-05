import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

function LoginCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function getTokens() {
      // access-token, consumer-id, next-page 값을 찾아서 가져옴
      // next-page에는 값이 'main'과 'sign-up' 이 있다.
      const accessToken = await searchParams.get("access-token");
      const consumerId = await searchParams.get("consumer-id");
      const nextPage = await searchParams.get("next-page");
      
      // firebase 연결
      const vapidKey = import.meta.env.VITE_FCM_VAPID_KEY;

      const firebaseConfig = {
        apiKey: import.meta.env.VITE_FCM_API_KEY,
        authDomain: import.meta.env.VITE_FCM_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FCM_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FCM_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FCM_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FCM_APP_ID,
        measurementId: import.meta.env.VITE_FCM_MEASUREMENT_ID,
      };

      const firebaseApp = initializeApp(firebaseConfig);
      const messaging = getMessaging(firebaseApp);

      // fcm 토큰 요청
      getToken(messaging, { vapidKey: `${vapidKey}` }).then((currentToken) => {
        if (currentToken) {
          saveToken(currentToken);
        } else {
          console.log('No registration token available. Request permission to generate one.');
        }
      }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
      });

      // fcm 토큰 저장 -> 서버에.
      const saveToken = async (token) => {
        
        // 위에서 요청한 fcm 토큰을 localStorage에도 저장
        localStorage.setItem("fcm-token", token)
        const postData = {
          fcmToken: token
        };

        try {
          console.log("토큰 저장 요청");
          
          const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/fcm-tokens`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(postData)
          });

          const responseData = await response.json();
          console.log(responseData);
        } catch (error) {
          console.error('POST 요청 중 에러 발생:', error);
        }
      };

      // 토큰값이 null 이 아닌 경우
      // localStroage에 access-token, consumer-id를 설정
      if (accessToken !== null) {
        localStorage.setItem("access-token", accessToken);
        localStorage.setItem("consumer-id", consumerId);
      }

      // localStroage에서 access-token을 받아왔다면
      if (localStorage.getItem("access-token")) {
        // nextPage의 값이 main이다 === 기존 회원
        // 메인 페이지로 돌려보낸다.
        if (nextPage === "main") {
          return navigate("/");
        }

        // 그게 아니다 === 신규회원
        else {
          return navigate("/input-profile");
        }
      } else {
        navigate("/");
      }
    }
    getTokens();
  });
  return;
}

export default LoginCallback;
