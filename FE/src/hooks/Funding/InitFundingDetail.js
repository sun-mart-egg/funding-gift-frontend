import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { getUserInfo } from "../../services/Consumer/getUserInfo";
import { getAnniversaryList } from "../../services/Funding/getAnniversaryList";
import getProductDetail from "../../services/Products/getProductDetail";

import useFormDataStore from "../../components/Store/FormDataStore";
import { useStore } from "../../components/Store/MakeStore";

export default function InitFundingDetail() {
  //라우팅 파라미터 읽어오기
  const location = useLocation();

  //zustand
  const { updateFormData } = useFormDataStore();
  const { selectedAnniversary, selectedAddress, selectedAccount } = useStore();

  //로컬 상태
  const [accessToken, setAccessToken] = useState("");
  const [product, setProduct] = useState(null);
  const [anniversaryCategory, setAnniversaryCategory] = useState([]);

  //라우터에서 전달받는 상품 ID & 옵션
  const productId = location?.state?.params;
  const productOption = location?.state?.option;

  //초기 마운트 되었을 때
  //1. 사용자 정보
  //2. 기념일 목록 가져오기
  //3. 상품 상세 정보 가져오기

  useEffect(() => {
    //토큰 가져오기
    const token = localStorage.getItem("access-token");

    //토큰이 있을 경우
    if (token) {
      setAccessToken(token);

      //사용자 정보 가져오기
      getUserInfo(token).then((data) => {
        if (data) {
          updateFormData("name", data.data.name);
          updateFormData("phoneNumber", data.data.phoneNumber);
        }
      });

      //기념일 목록 가져오기
      getAnniversaryList(token, setAnniversaryCategory);
    }

    //상품 정보 가져오기
    if (productId) {
      getProductDetail(productId).then((data) => {
        setProduct(data.data);

        updateFormData("targetPrice", data.data.price);
        updateFormData("productId", data.data.productId);
        updateFormData("productOptionId", productOption);
      });
    }
  }, []);

  //선택된 계좌번호, 기념일, 주소가 바뀔때 마다 formData update
  useEffect(() => {
    if (selectedAnniversary) {
      updateFormData("anniversaryDate", selectedAnniversary.anniversaryDate);
    }
    if (selectedAccount) {
      updateFormData("accountBank", selectedAccount.accountBank);
      updateFormData("accountNo", selectedAccount.accountNo);
    }
    if (selectedAddress) {
      updateFormData("phoneNumber", selectedAddress.phoneNumber);
      updateFormData("defaultAddr", selectedAddress.defaultAddr);
      updateFormData("detailAddr", selectedAddress.detailAddr);
      updateFormData("zipCode", selectedAddress.zipCode);
    }
  }, [selectedAnniversary, selectedAccount, selectedAddress, updateFormData]);

  return {
    product,
    selectedAccount,
    selectedAddress,
    selectedAnniversary,
    accessToken,
    anniversaryCategory,
    setAnniversaryCategory,
  };
}
