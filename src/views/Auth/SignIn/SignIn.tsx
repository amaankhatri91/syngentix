import { useAppDispatch } from "@/store";
import { signInSuccess } from "@/store/auth/authSlice";
import useTheme from "@/utils/hooks/useTheme";
import {
  googleLogo,
  siginBottomImg,
  siginLogo,
  siginUpperImg,
} from "@/utils/logoUtils";

const SignIn = () => {
  const { theme, isDark } = useTheme();
  const dispatch = useAppDispatch();

  return (
    <div className="fixed inset-0  w-full flex items-center justify-center px-4 overflow-hidden">
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
          className={`relative rounded-[40px] p-7 md:p-12 text-center text-white overflow-hidden z-10 ${
            isDark ? "bg-[#0F1724]" : "bg-white"
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
                Sign in with Google to access your agent management dashboard
              </p>
            </div>
            <button
              className="w-full md:!w-[420px] mt-4  md:mt-14 google-btn flex items-center justify-center gap-3
                   normal-case font-medium text-sm md:text-md hover:bg-tranasparent hover:shadow-none"
              onClick={() =>
                dispatch(
                  signInSuccess({
                    accessToken: "dummy_token_123",
                    firstName: "Jignesh",
                    image: "https://via.placeholder.com/150",
                    email: "jignesh@test.com",
                  })
                )
              }
            >
              <img src={googleLogo()} className="h-4 md:h-5" alt="google" />
              Continue With Google
            </button>
            <p className="text-sm md:text-md mt-8 font-normal">
              By continuing, you agree to our Terms of Service and Privacy
              Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
