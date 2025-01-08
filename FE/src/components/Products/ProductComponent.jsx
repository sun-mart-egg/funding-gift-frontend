import { useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useInfiniteQuery } from "@tanstack/react-query"

import Star from '/imgs/star.png';
import ImageComingSoon from '/imgs/image_coming_soon.png'
import NoSearchResult from '/imgs/no_search_result.png'

import getProducts from '../../services/Products/getProducts.js';
import { formattedPrice, formattedReviewCnt } from '../../@common/formattedNumber.js';

function ProductComponent({ categoryId, keyword, sort }) {
  const observer = useRef();

  // 상품 목록 호출 쿼리 + 무한 스크롤
  const { data = { pages: [] }, fetchNextPage, hasNextPage, isLoading} = useInfiniteQuery({
    queryKey: ["products", categoryId, keyword, sort],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await getProducts({categoryId, keyword, page:pageParam, size:10, sort});
      console.log("상품목록 무한 스크롤 작동 확인 문구")
      return response
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasNext ? lastPage.page + 1 : undefined;
    },
  });

  // 상품 목록 데이터
  const products = data.pages.flatMap(page => page.data)

  // 시점 고정
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

  // 검색 결과에 없을 때
  const renderNoResultsMessage = () => {
    if (!isLoading && products.length === 0) {
      return (
        <div className='w-full h-full text-center flex flex-col items-center' style={{ backgroundColor: '#FFFBE8' }}>
          <p className='text-4xl font-cusFont4 pt-[30px]'>검색 결과가 없습니다.</p>
          <img src={NoSearchResult} className='w-[90%] h-auto'></img>
        </div>

      )
    }
    return null;
  };

  return (
    <div className="mt-4 flex min-h-[63%] w-[95.5%] flex-grow flex-wrap justify-center overflow-y-auto bg-white font-cusfont2">
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
      {renderNoResultsMessage()} {/* 검색 결과가 없을 때 메시지 표시 */}
    </div>
  );
}

export default ProductComponent;
