"use server";

import SalesOverview from "@/components/Admin/Dashboard/SalesOverview";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React, {Suspense} from "react";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import {ChartFilter} from "@/types/chartFilter";
import {ChartContext} from "@/types/chartContext";
import {getSalesCards, getSalesCharts} from "@/apis/dashbaordAPI";
import {getCookie} from "@/utils/cookie";
import formatDate from "@/libs/formatDate";
import DashboardSkeleton from "@/components/Skeleton/DashboardSkeleton";

export default async function DashBoardSalesPage() {
    const endDate = new Date(); // today
    const startDate = new Date(); // today

    startDate.setDate(endDate.getDate() - 30); // 30 days ago

    // 새로운 날짜 계산
    const comparedEndDate = new Date(startDate); // endDate 복사
    comparedEndDate.setDate(startDate.getDate() - 1); // 1일 빼기

    const comparedStartDate = new Date(comparedEndDate); // newEndDate 복사
    comparedStartDate.setDate(comparedEndDate.getDate() - 30); // 차이만큼 날짜 빼기

    const date = {
        startDate: formatDate(startDate), // format as YYYY-MM-DD
        endDate: formatDate(endDate), // format as YYYY-MM-DD
    };

    const member = await getCookie("member");

    const prefetchOptions = [
        {
            queryKey: ['salesCards', ChartFilter.DAY, date, ChartContext.TOPSALES],
            queryFn: () => getSalesCards({
                startDate: formatDate(startDate),
                endDate: formatDate(endDate),
                sellerEmail: member?.email || "",
                filter: ChartFilter.DAY,
                comparedStartDate: formatDate(comparedStartDate),
                comparedEndDate: formatDate(comparedEndDate),
                context: ChartContext.TOPSALES,
            }),
        },
        {
            queryKey: ['salesCharts', ChartFilter.DAY, date, ChartContext.TOPSALES],
            queryFn: () => getSalesCharts({
                startDate: formatDate(startDate),
                endDate: formatDate(endDate),
                sellerEmail: member?.email || "",
                filter: ChartFilter.DAY,
                comparedStartDate: formatDate(comparedStartDate),
                comparedEndDate: formatDate(comparedEndDate),
                context: ChartContext.TOPSALES,
            }),
        },
    ]

    return <div className="mx-auto">
        <Breadcrumb pageName="Sales Overview"/>
        <div className="flex flex-col gap-5">
            <Suspense fallback={<DashboardSkeleton/>}>
                <PrefetchBoundary prefetchOptions={prefetchOptions}>
                    <SalesOverview/>
                </PrefetchBoundary>
            </Suspense>
        </div>
    </div>
}