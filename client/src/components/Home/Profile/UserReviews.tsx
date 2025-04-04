"use client";
import {useQuery} from "@tanstack/react-query";
import {DataResponse} from "@/interface/DataResponse";
import {useRouter} from "next/navigation";
import {Review} from "@/interface/Review";
import {StarIcon} from "@heroicons/react/20/solid";
import React from "react";
import Image from "next/image";
import {getUserReviews} from "@/apis/mallAPI";

const UserReviews = () => {
    const router = useRouter();

    const {data: myReviews, isLoading, error} = useQuery<DataResponse<Array<Review>>, Object, Array<Review>>({
        queryKey: ['myReviews'],
        queryFn: () => getUserReviews({queryKey: ['myReviews']}),
        staleTime: 60 * 1000,
        gcTime: 300 * 1000,
        throwOnError: true,
        select: (data) => {
            // 데이터 가공 로직만 처리
            return data.data;
        }
    });


    if (isLoading) return <div className="text-center py-4">Loading...</div>;

    return (
        <section className="w-full bg-white">
            <p className="text-lg mb-4 font-bold">작성한 리뷰</p>
            {
                myReviews?.map((review) => (
                    <div className="mb-2 cursor-pointer" key={review.rno} onClick={()=>router.push(`/product/${review.pno}`)} >
                        <ul className="border border-gray-200 rounded p-3 text-sm">
                            <li className="flex py-1.5 gap-2">
                                <Image src={review.order?.productInfo.thumbnailUrl || "/images/mall/no_image.png"} alt={'image'} width={500} height={500} className="w-20 h-20 rounded object-cover"/>
                                <div className="flex flex-col gap-2 justify-center">
                                <span className="font-semibold">{review.order?.productInfo.pname}</span>
                                <span className="text-gray-500 text-xs">{review.order?.productInfo.size} | {review.order?.productInfo.color.text}</span>
                                </div>
                            </li>
                            <li className="flex items-center py-1.5 gap-1">
                                <span className="flex">
                                  {Array.from({length: 5}).map((_, index) => (
                                      <StarIcon
                                          key={index}
                                          className={`w-5 h-5 ${index < review.rating ? 'text-ecom' : 'text-gray-300'}`}
                                      />
                                  ))}
                                </span>
                                <span
                                    className="text-gray-400 text-xs">{new Date(review.order?.createdAt || "").toLocaleDateString()} 구매</span>
                            </li>
                            <li className="flex py-1.5">
                                <span className="text-gray-800 text-xs">{review.content}</span>
                            </li>

                        </ul>
                    </div>))
            }
        </section>

    )
        ;
};

export default UserReviews;
