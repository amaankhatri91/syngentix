import { Formik, Form, Field, ErrorMessage } from "formik";
import useTheme from "@/utils/hooks/useTheme";
import useGoogleAuth from "@/utils/hooks/useGoogleAuth";
import useAuth from "@/utils/hooks/useAuth";
import useRefetchQueries from "@/utils/hooks/useRefetchQueries";
import { Button } from "@/components/Button";
import { FormikInput } from "@/components/FormikInput";
import { FormikSelect } from "@/components/FormikSelect";
import {
  googleLogo,
  siginBottomImg,
  siginLogo,
  siginUpperImg,
} from "@/utils/logoUtils";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import { useAppSelector } from "@/store";
import { UserRegisterCredential } from "@/@types/auth";
import * as Yup from "yup";

const SignIn = () => {
  const { theme, isDark } = useTheme();
  const { triggerGoogleLogin } = useGoogleAuth();
  const { googleSignIn, registerUser } = useAuth();
  const { invalidateAllQueries } = useRefetchQueries();
  const { can_register, register_email } = useAppSelector(
    (state) => state.auth
  );

  const registrationSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    workspace_id: Yup.string().required("Required"),
  });

  return (
    <Formik
      initialValues={
        can_register
          ? {
              name: "",
              email: register_email || "",
              workspace_id: "",
            }
          : {}
      }
      validationSchema={can_register ? registrationSchema : undefined}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          setSubmitting(true);
          if (can_register) {
            // Registration flow
            const result = await registerUser(values as UserRegisterCredential);
            if (result?.status === "success") {
              invalidateAllQueries();
              showSuccessToast(result.message || "Registration successful!");
            } else if (result?.status === "failed") {
              showErrorToast(result.message || "Registration failed");
            }
          } else {
            // Google sign-in flow
            const googleUser = await triggerGoogleLogin();
            const result = await googleSignIn(googleUser);
            if (result?.status === "success") {
              invalidateAllQueries();
              showSuccessToast(result.message || "Sign in successful!");
            } else if (result?.status === "failed") {
              // Only show error if registration is not required
              // If requiresRegistration is true, the state is already set in googleSignIn
              if (!result?.requiresRegistration) {
                showErrorToast(result.message || "Google sign-in failed");
              }
            }
          }
        } catch (error: any) {
          console.error("Auth error:", error);
          showErrorToast(
            error?.message || "An unexpected error occurred. Please try again."
          );
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, errors, touched, setFieldTouched, setFieldValue }) => (
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
              className={`relative rounded-[40px] text-center overflow-hidden z-10 ${
                isDark ? "bg-[#0F1724] text-white" : "bg-white text-gray-900"
              } ${
                can_register ? "px-8 md:px-20 py-12 md:py-12" : "p-7 md:p-12"
              }`}
            >
              <div className="relative z-10 flex flex-col items-center">
                <div
                  className={`flex flex-col items-center gap-2 ${
                    can_register ? "mb-8" : "mb-12"
                  }`}
                >
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
                    {can_register
                      ? "Sign up to create your Workflow"
                      : "Sign in with Google to access your agent management dashboard"}
                  </p>
                </div>
                {can_register && (
                  <div className="w-full">
                    <div className="text-left w-full">
                      <label className="block text-sm md:text-base mb-1">
                        Name
                      </label>
                      <Field name="name">
                        {({ field }: any) => (
                          <FormikInput
                            field={field}
                            type="text"
                            placeholder="Please enter your name"
                            errors={errors}
                            touched={touched}
                            onFieldTouched={() => setFieldTouched("name", true)}
                            onFieldChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              setFieldValue("name", e.target.value);
                            }}
                          />
                        )}
                      </Field>
                      <div className="min-h-[20px] mt-1">
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                    </div>
                    <div className="text-left w-full">
                      <label className="block text-sm md:text-base mb-1">
                        Email
                      </label>
                      <Field name="email">
                        {({ field }: any) => (
                          <FormikInput
                            field={field}
                            type="email"
                            placeholder="Please enter your email"
                            errors={errors}
                            touched={touched}
                            onFieldTouched={() => setFieldTouched("email", true)}
                            onFieldChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              setFieldValue("email", e.target.value);
                            }}
                          />
                        )}
                      </Field>
                      <div className="min-h-[20px] mt-1">
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                    </div>
                    <div className="text-left w-full">
                      <label className="block text-sm md:text-base mb-1">
                        Workspace
                      </label>
                      <Field name="workspace_id">
                        {({ field }: any) => (
                          <FormikSelect
                            field={field}
                            options={[
                              { value: "workspace1", label: "Workspace 1" },
                              { value: "workspace2", label: "Workspace 2" },
                              { value: "workspace3", label: "Workspace 3" },
                            ]}
                            placeholder="Please Select"
                            errors={errors}
                            touched={touched}
                            onFieldTouched={() => setFieldTouched("workspace_id", true)}
                            onFieldChange={(value) => {
                              setFieldValue("workspace_id", value?.value || "");
                            }}
                          />
                        )}
                      </Field>
                      <div className="min-h-[20px] mt-1">
                        <ErrorMessage
                          name="workspace_id"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  width="w-full "
                  className={`mt-4 md:mt-14  gap-3 normal-case text-sm md:text-base hover:bg-transparent hover:shadow-none ${
                    can_register ? "signup-btn" : "google-btn"
                  }`}
                  icon={
                    !can_register && (
                      <img
                        src={googleLogo()}
                        className="h-4 md:h-5"
                        alt="google"
                      />
                    )
                  }
                  iconPosition="prefix"
                >
                  {`${can_register ? "Sign Up" : "Continue With Google"}`}
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
