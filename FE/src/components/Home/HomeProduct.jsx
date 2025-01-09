import { useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useInfiniteQuery } from "@tanstack/react-query"

import Star from '/imgs/star.png';
import ImageComingSoon from '/imgs/image_coming_soon.png'
import getRecommendProducts from '../../services/Products/getRecommendProducts';
import { formattedPrice, formattedReviewCnt } from '../../@common/formattedNumber';

function ProductComponent({ categoryId, keyword, sort }) {
  const observer = useRef();

  // 추천상품 호출 + 무한 스크롤 쿼리
  const { data = { pages: [] }, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["products"],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await getRecommendProducts(pageParam, 10);
      console.log("추천상품 무한 스크롤 작동")
      return response;
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasNext ? allPages.length : undefined;
    }
  });

  // 상품 정보 데이터 평탄화 작업
  // 기존 페이지의 상품 + 다음 페이지의 상품 데이터를 하나의 배열로 합쳐준다
  const products = data.pages.flatMap(page => page.data)

  // 이전에 보고있던 위치에 스크롤을 멈춰줌
  const lastProductElementRef = useCallback(node => {
    if (isLoading || !hasNextPage) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasNextPage]);

  return (
    <div className="flex min-h-[63%] w-[95.5%] flex-grow flex-wrap justify-center overflow-y-auto bg-white font-cusfont2">
      {products.map((product, index) => (
        <div
          key={`${product.productId}-${index}`}
          ref={index === products.length - 1 ? lastProductElementRef : null}
          className="m-2 h-[58.5%] w-[45%] flex-col rounded-md text-[12px]"
        >
          {/* 이미지 */}
          <div className="w-full relative pt-[100%] rounded-md"> {/* paddingTop is same as width to maintain 1:1 aspect ratio */}
            <Link to={`/product/${product.productId}`}>
              <img src={product.imgUrl || ImageComingSoon} alt="" className="absolute top-0 left-0 w-[100%] h-[100%] object-cover rounded-md"/>
            </Link>
          </div>
          {/* 상품 정보 */}
          <div className="m-[1px] flex h-[30%] w-[100%] flex-col justify-center p-[10px] pl-2">
            <div>
              <p className='truncate'>{product.productName}</p>
              <p>{formattedPrice(product.price)}원</p>
              <p className="flex items-center">
                <img src={Star} alt="" className="h-[12px] w-[12px]" />
                <span className="ml-1">
                  {formattedReviewCnt(product.reviewAvg)}({product.reviewCnt})
                </span>
              </p>
            </div>
          </div>
        </div>
      ))}
      {isLoading && <p>Loading more products...</p>}
    </div>
  );
}

export default ProductComponent;
