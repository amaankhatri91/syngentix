import { SignInCredential, SignInResponse, GoogleSignUpCredential, GoogleSignInResponse, UserRegisterCredential, UserRegisterResponse } from "@/@types/auth";
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

export async function apiGoogleSignIn(data: GoogleSignUpCredential) {
    return ApiService.fetchData<GoogleSignInResponse>({
        url: 'v1/auth/google',
        method: 'post',
        data,
        headers : {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    })
}

export async function apiRegister(data: UserRegisterCredential) {
    return ApiService.fetchData<UserRegisterResponse>({
        url: 'v1/auth/register',
        method: 'post',
        data,
        headers : {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    })
}

