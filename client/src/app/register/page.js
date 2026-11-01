
import AuthLayout from "../components/auth/AuthLayout";
import AuthForm from "../components/auth/AuthForm";

export const metadata = {
  title: "Create Account | Learnify",
  description: "Create your Learnify account and start learning.",
};

export default function RegisterPage() {
  return (
    <AuthLayout
      mode="register"
      title="Join Learnify!"
      description="Create your account and take the first step toward building new skills."
    >
      <AuthForm mode="register" />
    </AuthLayout>
  );
}
