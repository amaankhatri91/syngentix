import ApiService from "./ApiService";

export async function apiGetProductList() {
    return ApiService.fetchData({
        url: 'products',
        method: 'get',
        headers : {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    })
}