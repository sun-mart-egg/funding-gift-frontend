import { useEffect, useState } from "react";

import { getConsumers } from "../../services/Consumer/consumers";
import { getAnniversaryList } from "../../services/Funding/getAnniversaryList";
import { getProductDetail } from "../../services/Products/products";

import useFormDataStore from "../../components/Store/FormDataStore";
import { useStore } from "../../components/Store/MakeStore";

export default function InitFundingDetail() {
  //zustand
  const { formData, updateFormData } = useFormDataStore();
  const { selectedAnniversary, selectedAddress, selectedAccount } = useStore();

  //로컬 상태
  const [accessToken, setAccessToken] = useState("");
  const [product, setProduct] = useState(null);
  const [anniversaryCategory, setAnniversaryCategory] = useState([]);

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
      getConsumers().then((data) => {
        if (data) {
          updateFormData("name", data.name);
          updateFormData("phoneNumber", data.phoneNumber);
        }
      });

      //기념일 목록 가져오기
      getAnniversaryList(token, setAnniversaryCategory);
    }

    //상품 정보 가져오기
    if (formData.productId) {
      getProductDetail(formData.productId).then((data) => {
        setProduct(data.data);
        console.log("product 세팅 됨");
        updateFormData("targetPrice", data.data.price);
        updateFormData("productId", data.data.productId);
      });
    }
  }, []);

  useEffect(() => {
    console.log(formData);
  }, [formData]);

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
