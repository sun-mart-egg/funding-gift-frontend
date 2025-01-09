import NoReview from "/imgs/no_review.png";
import Star from "/imgs/star.png";

const ReviewList = ({ reviews, isDeleteReview }) => {
  return (
    <>
      <div className="mt-[20px]">
        {reviews &&
          reviews.map((review) => (
            <div
              key={review.reviewId}
              className="mt-4 flex w-full flex-col items-start justify-between"
            >
              {/* 리뷰 프로필 이미지, 별점, 이름 */}
              <div className="mb-2 flex items-center">
                <div className="mr-[3%] aspect-square w-[18%] overflow-hidden rounded-full bg-black">
                  <img
                    src={review.writerProfile}
                    alt={review.writerName}
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>
                <div className="w-[100%]">
                  <p className="mb-[5px]">{review.writerName}</p>
                  <div className="flex items-center">
                    <img
                      src={Star}
                      alt=""
                      className="aspect-auto w-[7%] object-contain pb-1"
                    />
                    <span className="ml-1">{review.star} / 5</span>
                  </div>
                  <div>{review.name}</div>
                </div>
                <div className="w-[20%]">
                  {review.isMe && (
                    <div
                      onClick={() => isDeleteReview(review.reviewId)}
                      className="text-red-500"
                    >
                      삭제
                    </div>
                  )}
                </div>
              </div>

              {/* 리뷰 이미지 */}
              <div className="flex w-full">
                {review.image2 && !review.image1 && (
                  <div className="my-[20px] flex w-full">
                    <div
                      className={`mx-[2.5%] h-[150px] w-[50%] rounded-md bg-gray-300`}
                    >
                      <img
                        src={review.image2}
                        alt="Review Image2"
                        className="h-full w-full rounded-md object-cover"
                      />
                    </div>
                  </div>
                )}

                {review.image1 && !review.image2 && (
                  <div className="my-[20px] flex w-full">
                    <div
                      className={`mx-[2.5%] h-[150px] w-[50%] rounded-md bg-gray-300`}
                    >
                      <img
                        src={review.image1}
                        alt="Review Image1"
                        className="h-full w-full rounded-md object-cover"
                      />
                    </div>
                  </div>
                )}

                {review.image1 && review.image2 && (
                  <div className="my-[20px] flex w-full">
                    <div
                      className={`mx-[2.5%] h-[150px] w-[100%] rounded-md bg-gray-300`}
                    >
                      <img
                        src={review.image1}
                        alt="Review Image1"
                        className="h-full w-full rounded-md object-cover"
                      />
                    </div>
                    <div
                      className={`mx-[2.5%] h-[150px] w-[100%] rounded-md bg-gray-300`}
                    >
                      <img
                        src={review.image2}
                        alt="Review Image2"
                        className="h-full w-full rounded-md object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 리뷰 내용 */}
              <div className="ml-7-1 mb-2 h-[100px] w-[100%] rounded-md border-[2px] p-2">
                <p className="text-xs">{review.content}</p>
              </div>
            </div>
          ))}
        {reviews.length === 0 && (
          <div
            className="text-md text-center font-cusFont4"
            style={{ backgroundColor: "#FFFFF6" }}
          >
            <img src={NoReview} alt="" />
            <p>아직 리뷰가 없어요. 펀딩을 만들고 리뷰를 작성해보세요!</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ReviewList;
