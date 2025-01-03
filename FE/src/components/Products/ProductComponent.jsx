import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

import Star from '/imgs/star.png';
import Logo from '/imgs/logo.png';
import ImageComingSoon from '/imgs/image_coming_soon.png'

import NoSearchResult from '/imgs/no_search_result.png'

import getProducts from '../../services/Products/getProducts.js';

function ProductComponent({ categoryId, keyword, sort }) {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();

  const lastProductElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setCurrentPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    // Reset products when categoryId or sort changes
    setCurrentPage(0);
    setProducts([]);
  }, [categoryId, sort, keyword]);

  useEffect(() => {
    // Fetch products when currentPage changes
    loadProducts(currentPage);
  }, [currentPage, categoryId, sort, keyword]);

  const renderNoResultsMessage = () => {
    if (!loading && products.length === 0) {
      return (
        <div className='w-full h-full text-center flex flex-col items-center' style={{ backgroundColor: '#FFFBE8' }}>
          <p className='text-4xl font-cusFont4 pt-[30px]'>검색 결과가 없습니다.</p>
          <img src={NoSearchResult} className='w-[90%] h-auto'></img>
        </div>

      )
    }
    return null;
  };

  const loadProducts = async (page) => {
    setLoading(true);
    try {
      const response = await getProducts({categoryId, keyword, page, size: 10, sort: 0});
      console.log("상품 목록 조회 성공")
      if (response.code === 200 && response.data) {
        // 현재 페이지가 0인 경우 새 데이터 설정, 그 외에는 기존 데이터에 추가
        const newData = page === 0 ? response.data.data : [...products, ...response.data.data.filter(newItem => !products.some(prevItem => prevItem.productId === newItem.productId))];
        setProducts(newData);
        setHasMore(response.data.hasNext === true);
      } else {
        console.error('Error fetching products:', response.msg);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    setLoading(false);
  };

  const numberWithCommas = (number) => {
    return number.toLocaleString();
  };

  const formatReviewNum = (num) => {
    return num >= 1000 ? "999+" : num;
  };



  return (
    <div className="mt-4 flex min-h-[63%] w-[95.5%] flex-grow flex-wrap justify-center overflow-y-auto bg-white font-cusfont2">
      {products.map((product, index) => (
        <div
          key={product.productId}
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
              <p>{numberWithCommas(product.price)}원</p>
              <p className="flex items-center">
                <img src={Star} alt="" className="h-[12px] w-[12px]" />
                <span className="ml-1">
                  {formatReviewNum(product.reviewAvg)}({product.reviewCnt})
                </span>
              </p>
            </div>
          </div>
        </div>
      ))}
      {loading && <p>Loading more products...</p>}
      {renderNoResultsMessage()} {/* 검색 결과가 없을 때 메시지 표시 */}
    </div>
  );
}

export default ProductComponent;
