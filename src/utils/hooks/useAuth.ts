import {
    useAppSelector,
    useAppDispatch,
} from '@/store'
import { useNavigate } from 'react-router-dom'
import { SignInCredential } from '@/@types/auth'
import { apiSignIn } from '@/services/AuthService'
import { signInSuccess, signOutSuccess } from '@/store/auth/authSlice'

type Status = 'success' | 'failed'

function useAuth() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { token } = useAppSelector((state) => state.auth)
    const signIn = async (
        values: SignInCredential
    ): Promise<
        | {
              status: 'success' | 'failed';
              message: string;
          }
        | undefined
    > => {
        try {
            const resp = await apiSignIn(values);
            console.log(resp, 'Verify Response and Check It');
    
            if (resp?.data) {
                const data:any = resp.data;  // assuming the response contains a token
                dispatch(signInSuccess(data));  // Dispatch success action with the token
                 navigate('/')
                return {
                    status: 'success',
                    message: 'Login successful',
                };
            }
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.message || 'Something went wrong',
            };
        }
    };
    

    const handleSignOut = () => {
        dispatch(
            signOutSuccess({
                avatar: '',
                userName: '',
                email: '',
                token: null
            })
        )
        navigate('/sign-in')
    }

    const signOut = async () => {
        try {
            // await apiSignOut()  
            handleSignOut()     
        } catch (error) {
            console.error('Sign out failed:', error)
        }
    }

    return {
        authenticated: token,
        signIn,
        signOut,
    }
}

export default useAuth
