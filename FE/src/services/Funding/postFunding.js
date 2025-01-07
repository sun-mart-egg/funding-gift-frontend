//펀딩 생성 api (post)

import axiosInstance from "../../@common/axiosInstance";

const formatDate = (date) => {
  const d = new Date(date);
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  let year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

const postFunding = async (formData, token) => {
  //날짜를 한국 시간대로 변환하는 함수
  const toKoreanTimeZone = (date) => {
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + userTimezoneOffset + 9 * 60 * 60 * 1000);
  };

  //한국 시간대로 날짜 조정
  const modifiedFormData = {
    ...formData,
    startDate: formatDate(toKoreanTimeZone(formData.startDate)),
    endDate: formatDate(toKoreanTimeZone(formData.endDate)),
    name: "신시은",
    phoneNumber: "010-4948-7118",
  };

  //콘솔에 변형된 한국 시간 출력
  console.log("Modified form data:", JSON.stringify(modifiedFormData));

  const response = await axiosInstance.post(
    "/api/fundings",
    JSON.stringify(modifiedFormData),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  console.log("펀딩을 성공적으로 post 하였습니다", response);
};

export { postFunding };
