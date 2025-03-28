import {GARequest} from "@/interface/GARequest";
import {fetchJWT} from "@/utils/fetchJWT";
import {TopCustomerRequest} from "@/interface/TopCustomerRequest";
import {ChartRequest} from "@/interface/ChartRequest";



export async function getGARecentUsers (param: GARequest) {

    return await fetchJWT(`/api/dashboard/real-time?startDate=${param.startDate}&endDate=${param.endDate}&sellerEmail=${param.sellerEmail}&comparedStartDate=${param.comparedStartDate}&comparedEndDate=${param.comparedEndDate}&filter=${param.filter}`, {
        method: "GET",
        next: {
            tags: ['gaRecentUsers'], //다시
        },
        credentials: 'include',
        cache: 'no-store', //요청마다 동적인 데이터를 얻고 싶다면
    });
}

export async function getGoogleAnalytics (param: GARequest) {
    return await fetchJWT(`/api/dashboard/traffic?startDate=${param.startDate}&endDate=${param.endDate}&sellerEmail=${param.sellerEmail}&comparedStartDate=${param.comparedStartDate}&comparedEndDate=${param.comparedEndDate}&filter=${param.filter}`, {
        method: "GET",
        next: {
            tags: ['ga'], //다시
        },
        credentials: 'include',
        cache: 'no-store',
    });
}

export async function getSalesByCountry (param: TopCustomerRequest) {

    return await fetchJWT(`/api/dashboard/salesByCountry?startDate=${param.startDate}&endDate=${param.endDate}&sellerEmail=${param.sellerEmail}`, {
        method: "GET",
        next: {
            tags: ['countries'], //다시
        },
        credentials: 'include',
        cache: 'no-store',
    });
}

export async function getSalesCards (param: ChartRequest) {

    return await fetchJWT(`/api/dashboard/salesOverviewCard?startDate=${param.startDate}&endDate=${param.endDate}&sellerEmail=${param.sellerEmail}&filter=${param.filter}&comparedStartDate=${param.comparedStartDate}&comparedEndDate=${param.comparedEndDate}&context=${param.context}`, {
        method: "GET",
        next: {
            tags: ['salesCards'], //다시
        },
        credentials: 'include',
        cache: 'no-store',
    });
}

export async function getSalesCharts (param: ChartRequest) {

   return await fetchJWT(`/api/dashboard/salesOverviewChart?startDate=${param.startDate}&endDate=${param.endDate}&sellerEmail=${param.sellerEmail}&filter=${param.filter}&comparedStartDate=${param.comparedStartDate}&comparedEndDate=${param.comparedEndDate}&context=${param.context}`, {
       method: "GET",
       next: {
           tags: ['salesCharts'], //다시
       },
       credentials: 'include',
       cache: 'no-store',
    });

}

export async function getTopCustomers (param: TopCustomerRequest) {

    return await fetchJWT(`/api/dashboard/salesCustomers?startDate=${param.startDate}&endDate=${param.endDate}&sellerEmail=${param.sellerEmail}`, {
        method: "GET",
        next: {
            tags: ['customers'], //다시
        },
        credentials: 'include',
        cache: 'no-store',
    });

}

export async function getTopProducts (param: TopCustomerRequest) {

    return await fetchJWT(`/api/dashboard/salesProducts?startDate=${param.startDate}&endDate=${param.endDate}&sellerEmail=${param.sellerEmail}`, {
        method: "GET",
        next: {
            tags: ['products'],
        },
        credentials: 'include',
        cache: 'no-store',
    });

}