import { useAppSelector, useAppDispatch } from "@/store";
import { useNavigate } from "react-router-dom";
import {
  GoogleSignUpCredential,
  SignInCredential,
  UserRegisterCredential,
} from "@/@types/auth";
import {
  apiGoogleSignIn,
  apiSignIn,
  apiRegister,
} from "@/services/AuthService";
import {
  signInSuccess,
  signOutSuccess,
  setCanRegister,
} from "@/store/auth/authSlice";
import RtkQueryService from "@/services/RtkQueryService";

function useAuth() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { token } = useAppSelector((state) => state.auth);

  const signIn = async (
    values: SignInCredential
  ): Promise<
    | {
        status: "success" | "failed";
        message: string;
      }
    | undefined
  > => {
    try {
      const resp = await apiSignIn(values);
      console.log(resp, "Verify Response and Check It");
      if (resp?.data) {
        const data: any = resp.data;
        dispatch(signInSuccess(data));
        navigate("/");

        return {
          status: "success",
          message: "Login successful",
        };
      }
    } catch (errors: any) {
      return {
        status: "failed",
        message:
          errors?.response?.data?.message ||
          errors.message ||
          "Something went wrong",
      };
    }
  };

  const googleSignIn = async (
    values: GoogleSignUpCredential
  ): Promise<{
    status: "success" | "failed";
    message: string;
    requiresRegistration?: boolean;
  }> => {
    try {
      const resp = await apiGoogleSignIn(values);
      console.log(resp, "Login Api Integration");
      if (resp?.status === 200) {
        const { token, user, workspace, workspaces } = resp.data.data;
        const responseMessage = resp.data.message || "Login successful";
        if (!token || !user || !workspace) {
          return {
            status: "failed",
            message: "Invalid response data",
          };
        }
        dispatch(
          signInSuccess({
            accessToken: token.access_token,
            refreshToken: token.refresh_token,
            userName: user.display_name,
            email: user.email,
            avatar: user.photo_url,
            userId: user.id,
            userType: user.type,
            googleId: user.google_id,
            agents: user.agents,
            defaultWorkspaceId: user.default_workspace_id,
            workspace: workspace,
            workspaces: workspaces || [],
          })
        );
        navigate("/");
        return {
          status: resp.data.status || "success",
          message: responseMessage,
        };
      } else {
        const responseData = resp?.data;
        const canRegister =
          responseData?.data?.can_register ||
          responseData?.data?.registration_required;
        if (resp?.status === 404 && canRegister) {
          const email = responseData?.data?.email || values.email;
          dispatch(
            setCanRegister({
              can_register: true,
              register_email: email,
            })
          );
          return {
            status: "failed",
            message: responseData?.message || "Registration required",
            requiresRegistration: true,
          };
        }
        return {
          status: "failed",
          message: responseData?.message || "Sign in failed",
        };
      }
    } catch (error: any) {
      return {
        status: "failed",
        message:
          error?.response?.data?.data?.message ||
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
      };
    }
  };

  const registerUser = async (
    values: UserRegisterCredential
  ): Promise<
    | {
        status: "success" | "failed";
        message: string;
      }
    | undefined
  > => {
    try {
      const resp = await apiRegister(values);
      console.log(resp, "Register Api Integration");
      if (resp?.data?.status === "success" && resp?.data?.data) {
        const { token, user, workspace, workspaces } = resp.data.data;
        const responseMessage = resp.data.message || "Registration successful";
        dispatch(
          signInSuccess({
            accessToken: token.access_token,
            refreshToken: token.refresh_token,
            userName: user.display_name,
            email: user.email,
            avatar: user.photo_url,
            userId: user.id,
            userType: user.type,
            googleId: user.google_id,
            agents: user.agents,
            defaultWorkspaceId: user.default_workspace_id,
            workspace: workspace,
            workspaces: workspaces || [],
          })
        );
        navigate("/");
        return {
          status: "success",
          message: responseMessage,
        };
      } else {
        return {
          status: resp?.data?.status || "failed",
          message: resp?.data?.message || "Registration failed",
        };
      }
    } catch (error: any) {
      return {
        status: "failed",
        message:
          error?.response?.data?.data?.message ||
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
      };
    }
  };

  const handleSignOut = () => {
    // Reset RTK Query cache on logout to clear all cached data
    dispatch(RtkQueryService.util.resetApiState());

    dispatch(
      signOutSuccess({
        avatar: "",
        userName: "",
        email: "",
        token: null,
      })
    );
    navigate("/sign-in");
  };

  const signOut = async () => {
    try {
      // await apiSignOut()
      handleSignOut();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return {
    authenticated: token,
    signIn,
    signOut,
    googleSignIn,
    registerUser,
  };
}

export default useAuth;
