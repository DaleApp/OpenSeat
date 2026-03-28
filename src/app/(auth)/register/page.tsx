import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-brand rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-3xl text-white font-bold">O</span>
        </div>
        <h1 className="text-2xl font-bold text-text-primary">Create account</h1>
        <p className="text-text-secondary text-sm mt-1">
          Join your UNC community on OpenSeat
        </p>
      </div>

      <RegisterForm />

      <p className="text-center text-sm text-text-secondary">
        Already have an account?{" "}
        <Link href="/login" className="text-brand font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
