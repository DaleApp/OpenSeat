import Link from "next/link";
import Image from "next/image";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <Image src="/logo.png" alt="OpenSeat" width={64} height={64} className="mx-auto mb-3" />
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
