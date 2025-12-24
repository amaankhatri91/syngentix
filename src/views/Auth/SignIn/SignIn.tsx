import { Formik, Form } from "formik";
import useTheme from "@/utils/hooks/useTheme";
import useGoogleAuth from "@/utils/hooks/useGoogleAuth";
import useAuth from "@/utils/hooks/useAuth";
import useRefetchQueries from "@/utils/hooks/useRefetchQueries";
import { Button } from "@/components/Button";
import {
  googleLogo,
  siginBottomImg,
  siginLogo,
  siginUpperImg,
} from "@/utils/logoUtils";
import { showSuccessToast, showErrorToast } from "@/utils/toast";

const SignIn = () => {
  const { theme, isDark } = useTheme();
  const { triggerGoogleLogin } = useGoogleAuth();
  const { googleSignIn } = useAuth();
  const { invalidateAllQueries } = useRefetchQueries();

  return (
    <Formik
      initialValues={{}}
      onSubmit={async (_values, { setSubmitting }) => {
        try {
          setSubmitting(true);
          const googleUser = await triggerGoogleLogin();
          const result = await googleSignIn(googleUser);
          if (result?.status === "success") {
            // Invalidate all query caches to trigger refetch when components load
            invalidateAllQueries();
            showSuccessToast(result.message || "Sign in successful!");
          } else if (result?.status === "failed") {
            showErrorToast(result.message || "Google sign-in failed");
          }
        } catch (error: any) {
          console.error("Google sign-in error:", error);
          showErrorToast(
            error?.message || "An unexpected error occurred. Please try again."
          );
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form className="fixed inset-0 w-full flex items-center justify-center px-4 overflow-hidden">
          <div className="sigin-border relative">
            {isDark && (
              <>
                <img
                  src={siginUpperImg()}
                  alt="top background"
                  className="absolute left-1/2 -top-28 -translate-x-1/2 -translate-y-1/3 pointer-events-none w-full max-w-sm md:max-w-2xl z-0"
                />
                <img
                  src={siginBottomImg()}
                  alt="background"
                  className="absolute left-1/2 -bottom-28 -translate-x-1/2 translate-y-1/3 pointer-events-none w-full max-w-2xl z-0"
                />
              </>
            )}
            <div
              className={`relative rounded-[40px] p-7 md:p-12 text-center overflow-hidden z-10 ${
                isDark ? "bg-[#0F1724] text-white" : "bg-white text-gray-900"
              }`}
            >
              <div className="relative z-10 flex flex-col items-center">
                <div className="flex flex-col items-center gap-2 mb-10">
                  <img
                    src={siginLogo(theme)}
                    className="h-20 md:h-full"
                    alt="logo"
                  />
                </div>
                <div className="space-y-2 mb-4 md:mb-8">
                  <h2 className="text-lg md:text-[24px] font-semibold">
                    Welcome to Syngentix
                  </h2>
                  <p className="text-sm md:text-lg font-normal">
                    Sign in with Google to access your agent management
                    dashboard
                  </p>
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  width="w-full md:!w-[420px]"
                  className="mt-4 md:mt-14 google-btn gap-3 normal-case text-sm md:text-base hover:bg-transparent hover:shadow-none"
                  icon={
                    <img
                      src={googleLogo()}
                      className="h-4 md:h-5"
                      alt="google"
                    />
                  }
                  iconPosition="prefix"
                >
                  Continue With Google
                </Button>
                <p className="text-sm md:text-base mt-8 font-normal">
                  By continuing, you agree to our Terms of Service and Privacy
                  Policy.
                </p>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default SignIn;
