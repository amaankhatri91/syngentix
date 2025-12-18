export type SignInCredential = {
    password: string
    username: string
}

export type SignInResponse = {
    accessToken: string
    user: {
        userName: string
        authority: string[]
        avatar: string
        username: string
    }
}

export type SignUpResponse = SignInResponse

export type SignUpCredential = {
    username: string
    password: string
}

export type ForgotPassword = {
    username: string
}

export type ResetPassword = {
    password: string
}
