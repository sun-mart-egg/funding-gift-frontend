import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';
import { useMutation } from "@tanstack/react-query";
import { postFCMToken } from "../../services/Login/tokens"
import { getCookie, setCookie } from "../../@common/cookies";

function LoginCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // fcm-token 저장 mutate
  const saveFCMTokenMutate = useMutation({
    mutationFn: (token) => postFCMToken(token),
    onSuccess: (res) => {
      console.log("fcm-token 저장 성공");
      console.log(res);
    },
    onError: (err) => {
      console.log("fcm-token 저장 실패");
      console.error(err);
    },
  });

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
        
        // 위에서 요청한 fcm 토큰을 Cookie에도 저장
        setCookie("fcm-token", token);
        // 서버에도 저장하라는 api 요청 mutate
        saveFCMTokenMutate.mutate(token);
      };

      // 토큰값이 null 이 아닌 경우
      // Cookie에 access-token, consumer-id를 설정
      if (accessToken !== null) {
        setCookie("access-token", accessToken);
        setCookie("consumer-id", consumerId);
      }

      // Cookie에서 access-token을 받아왔다면
      if (getCookie("access-token")) {
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
