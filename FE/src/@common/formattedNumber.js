// 숫자 10000 -> 10,000 
export const formattedPrice = (number) => {
  return number.toLocaleString();
}

// 리뷰 1000개 이상 -> 999+
export const formattedReviewCnt = (number) => {
  return number >= 1000 ? "999+" : number;
}