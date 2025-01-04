import { useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

import ScrollToTop from "../UI/ScrollToTop2";
import ImageComingSoon from '/imgs/image_coming_soon.png'
import NoWishlist from '/imgs/no_wishlist.png'

import getWishlists from '../../services/Products/getWishLists';
import { useInfiniteQuery } from '@tanstack/react-query';


function Wishlist() {
	const observer = useRef();
	const consumerId = localStorage.getItem("consumer-id")

	// 위시리스트 관련 쿼리 ( + 무한 스크롤 기능 )
	// 수정 필요
	const { data = { pages: [] }, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
		queryKey: ["wishes", consumerId],
		queryFn: async ({ pageParam = 0 }) => {
			const response = await getWishlists(pageParam, 4);
			console.log("인피니티 쿼리 잘 작동하냐?")
			console.log(data);
			return response;
		},
		getNextPageParam: (lastPage, allPages) => {
			return lastPage.hasNext ? allPages.length : undefined;
		},
		// select: (data) => {
		// 	return data.pages.flatMap(page => page.data);
		// },
	});

	// 현재 페이지의 위시리스트만 가져오도록 설정
	// 수정 필요
	const wishes = data.pages.flatMap(page => page.data);

	// 스크롤 위치 저장 관련 로직
	// 수정 필요
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

	// 위시리스트에 담아둔 물건이 없을 경우 보여줄 UI
	const renderNoResultsMessage = () => {
		if (!isLoading && wishes.length === 0) {
			return (
				<div className='w-full h-full text-center flex flex-col items-center'>
					<p className='text-2xl font-cusFont4 pt-[30px]'>상품 목록에서 위시리스트를 추가해보세요!</p>
					<img src={NoWishlist} className='w-[90%] h-auto'></img>
					<Link to={`/product`}>
						<button className='bg-cusColor3 text-white text-2xl mt-[20px] px-[20px] py-[10px] rounded-md'>
							바로가기
						</button>
					</Link>
				</div>

			)
		}
		return null;
	};

	// 숫자 천 단위로 끊어주는 함수
	const numberWithCommas = (number) => {
		return number.toLocaleString();
	};

	return (
		<div className="sub-layer mt-[80px] justify-start min-h-screen overflow-hidden font-cusFont2 bg-white">
			<p className="font-cusFont5 text-4xl">나의 위시리스트</p>
			<div className="mt-4 flex min-h-[63%] w-[95.5%] flex-grow flex-wrap justify-center overflow-y-auto bg-white font-cusfont2">
				{wishes.map((product, index) => (
					<div
						key={product.productId}
						ref={index === wishes.length - 1 ? lastProductElementRef : null}
						className="border-[1px] border-gray-300 m-2 h-[42%] w-[45%] flex-col rounded-md text-[12px]"
					>
						{/* 이미지 */}
						<div className="w-full relative h-[70%] pt-[100%] rounded-md"> {/* paddingTop is same as width to maintain 1:1 aspect ratio */}
							<Link to={`/product/${product.productId}`}>
								<img src={product.imageUrl || ImageComingSoon} alt="" className="absolute top-0 left-0 w-[100%] h-[100%] object-cover rounded-md" />
							</Link>
						</div>
						{/* 상품 정보 */}
						<div className="m-[1px] flex h-[30%] w-[100%] flex-col justify-center p-[10px] pl-2">
							<div>
								<p className='truncate'>{product.productName}</p>
								<p>{numberWithCommas(product.price)}원</p>
							</div>
						</div>
					</div>
				))}
				{isLoading && <p>Loading more products...</p>}
				{renderNoResultsMessage()} {/* 검색 결과가 없을 때 메시지 표시 */}
			</div>

			<ScrollToTop />
		</div>
	);
}


export default Wishlist