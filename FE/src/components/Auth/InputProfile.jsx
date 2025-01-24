import SignupLogo from "/imgs/signupLogo.png";
import useUserStore from "../Store/UserStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { putConsumers } from "../../services/Consumer/consumers"

function InputProfile() {
  const updateUserStore = useUserStore((state) => state.updateUserStore);
  const myName = useUserStore((state) => state.name);
  const myEmail = useUserStore((state) => state.email);
  const myPhoneNumber = useUserStore((state) => state.phoneNumber);
  const [myBirthDay, setMyBirthday] = useState("");
  const myGender = useUserStore((state) => state.gender);
  const navigate = useNavigate();

  // 입력한 정보에 대한 유효성 검사를 위한 상태변수
  const [profileErr, setProfileErr] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    birth: "",
    gender: "",
  });

  // 유효성 검사
  const profileIsValid = {
    name: (value) => {
      return value.length >= 1 && value.length <= 10 ? "" : "이름은 1자 이상 10자 이하이어야 합니다."
    },
    email: (value) => {
      const patternEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return !patternEmail.test(value) || value > 50 ? "이메일을 올바르게 입력해주세요." : ""
    },
    phoneNumber: (value) => {
      const patternPhoneNum = /^\d{10,11}$/;
      return !patternPhoneNum.test(value) ? "연락처를 올바르게 입력해주세요." : ""
    },
    birth: (value) => {
      return !/^\d{0,8}$/.test(value) || value.length !== 8 ? "생년월일을 올바르게 입력해주세요." : ""
    },
    gender: (value) => {
      return value ? "" : "성별을 선택해주세요."
    },
  };

  // 유효성 검사에 따른 에러 문구 업데이트
  const handleProfileValid = (field, value) => {
    setProfileErr((prev) => ({
      ...prev,
      [field]: profileIsValid[field](value)
    }));
  };

  // 정보 수정 요청 mutate
  // 성공 시, 회원가입 페이지로 이동
  const editMyInfoMutate = useMutation({
    mutationFn: ({ name, email, phoneNumber, birthyear, birthday, gender }) =>
      putConsumers(name, email, phoneNumber, birthyear, birthday, gender),
    onSuccess: () => {
      console.log("정보 수정 성공");
      navigate("/signup");
    },
    onError: (err) => {
      console.error("정보 수정 실패", err);
    },
  });

  // 이름 input에 입력하는 값을 store의 name에 저장
  const handleName = (event) => {
    const inputName = event.target.value;
    handleProfileValid("name", inputName);
    updateUserStore("name", inputName);
  };

  // e-mail input에 입력하는 값을 store의 email에 저장
  const handleEmail = (event) => {
    const inputEmail = event.target.value;
    handleProfileValid("email", inputEmail);
    updateUserStore("email", inputEmail);
  };

  // 생년월일 input에 입력하는 값을 store의 birthday에 저장
  const handleBirthday = (event) => {
    const inputBirthday = event.target.value;
    setMyBirthday(inputBirthday);
    // 생년월일 8자리에서 연도와 생일을 추출
    const birthyear = inputBirthday.toString().slice(0, 4);
    const birthday = inputBirthday.toString().slice(4);

    handleProfileValid("birth", inputBirthday);
    updateUserStore("birthyear", birthyear);
    updateUserStore("birthday", birthday);
  };

  // 연락처 input 에 입력하는 값을 store의 phoneNumber에 저장
  const handlePhoneNumber = (event) => {
    const inputPhoneNum = event.target.value;
    handleProfileValid("phoneNumber", inputPhoneNum);
    updateUserStore("phoneNumber", inputPhoneNum);
  };

  // 성별 정보
  const handleGender = (genderValue) => {
    handleProfileValid("gender", genderValue);
    updateUserStore("gender", genderValue);
  };

  // 서비스 최초 가입 시, 정보 수정을 서버에 요청하는 mutate
  const handleNextSignupPage = () => {
    const birthyear = myBirthDay.substring(0, 4);
    const birthday = myBirthDay.substring(4);
    editMyInfoMutate.mutate({
      name: myName,
      email: myEmail,
      phoneNumber: myPhoneNumber,
      birthyear: birthyear,
      birthday: birthday,
      gender: myGender,
    });
  };

  return (
    <div className="sub-layer top-[60px] gap-4">
      <img src={SignupLogo} alt="회원가입로고" className="m-3" />
      {/* 이름 입력 및 성별 선택 */}
      <div className="flex w-[330px] justify-between">
        <input
          type="text"
          placeholder="이름을 입력해주세요."
          className="common-btn signup-font h-[50px] w-[160px] border-[2.5px] bg-white p-3"
          value={myName}
          onChange={handleName}
          required
        />
        <div className="flex gap-3">
          <button
            className={`common-btn ${myGender === "male" ? "bg-blue-400" : "bg-gray-400"}`}
            onClick={() => handleGender("male")}
          >
            남자
          </button>
          <button
            className={`common-btn ${myGender === "female" ? "bg-red-400" : "bg-gray-400"}`}
            onClick={() => handleGender("female")}
          >
            여자
          </button>
        </div>
      </div>

      {profileErr.name && <p className="signup-font text-red-500">{profileErr.name}</p>}
      {profileErr.gender && <p className="signup-font text-red-500">{profileErr.gender}</p>}

      {/* 생년월일 입력 */}
      <input
        type="number"
        placeholder="생년/월/일 8자리를 입력해주세요"
        className="common-btn signup-font h-[50px] w-[330px] border-[2.5px] bg-white p-3"
        value={myBirthDay}
        onChange={handleBirthday}
        required
      />
      {profileErr.birth && <p className="signup-font text-red-500">{profileErr.birth}</p>}

      {/* 이메일 입력 */}
      <input
        type="text"
        placeholder="이메일을 입력해주세요."
        className="common-btn signup-font h-[50px] w-[330px] border-[2.5px] bg-white p-3"
        value={myEmail}
        onChange={handleEmail}
        required
      />
      {profileErr.email && <p className="signup-font text-red-500">{profileErr.email}</p>}

      {/* 연락처 입력 */}
      <input
        type="number"
        placeholder="연락처를 입력해주세요."
        className="common-btn signup-font h-[50px] w-[330px] border-[2.5px] bg-white p-3"
        value={myPhoneNumber}
        onChange={handlePhoneNumber}
        required
      />
      {profileErr.phoneNumber && <p className="signup-font text-red-500">{profileErr.phoneNumber}</p>}

      <button
        className="common-btn h-full max-h-[50px] w-full max-w-[284px]"
        onClick={handleNextSignupPage}
      >
        다음
      </button>
    </div>
  );
}

export default InputProfile;
