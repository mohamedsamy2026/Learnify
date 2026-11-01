
import AuthLayout from "../components/auth/AuthLayout";
import AuthForm from "../components/auth/AuthForm";

export const metadata = {
  title: "Log In | Learnify",
  description: "Log in to your Learnify account.",
};

export default function LoginPage() {
  return (
    <AuthLayout
      mode="login"
      title="Welcome Back!"
      description="Log in to continue learning, explore your courses, and track your progress."
    >
      <AuthForm mode="login" />
    </AuthLayout>
  );
}
