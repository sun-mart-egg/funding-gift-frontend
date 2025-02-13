import axios from "axios";

//내 펀딩 조회 api
async function fetchMyFundings(token, setMyFundings, setIsLoading) {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/fundings/my-fundings`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: 0,
          size: 100,
        },
      },
    );
    setMyFundings(response.data.data.data);
  } catch (error) {
    console.error("내가 만든 펀딩을 불러오는데 실패했습니다.", error);
  } finally {
    setIsLoading(false);
  }
}

//펀딩 삭제 api

async function deleteFunding(token, fundingId, navigate) {
  console.log("token :" + token);
  console.log("fundingID : " + fundingId);
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_BASE_URL}/api/fundings`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          // 'body' 대신 'data'를 사용합니다.
          fundingId: fundingId,
        },
      },
    );
    console.log("펀딩 삭제 응답 : ", response);
    alert("펀딩을 성공적으로 삭제하였습니다.");
    navigate("/my-funding");
  } catch (error) {
    alert(error.response.data.msg);
  }
}

export { fetchMyFundings, deleteFunding };
