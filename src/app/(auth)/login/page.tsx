import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-brand rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-3xl text-white font-bold">O</span>
        </div>
        <h1 className="text-2xl font-bold text-text-primary">Welcome back</h1>
        <p className="text-text-secondary text-sm mt-1">
          Sign in to your OpenSeat account
        </p>
      </div>

      <LoginForm />

      <p className="text-center text-sm text-text-secondary">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-brand font-medium hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
