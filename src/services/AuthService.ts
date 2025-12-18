import { SignInCredential, SignInResponse } from "@/@types/auth";
import ApiService from "./ApiService";

export async function apiSignIn(data: SignInCredential) {
    return ApiService.fetchData<SignInResponse>({
        url: 'auth/login',
        method: 'post',
        data,
        headers : {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    })
}

