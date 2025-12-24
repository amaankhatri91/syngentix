import { SignInCredential, SignInResponse, GoogleSignUpCredential, GoogleSignInResponse } from "@/@types/auth";
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

