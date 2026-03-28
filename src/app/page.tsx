import Link from "next/link";

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-8">
        <div className="w-20 h-20 bg-brand rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl text-white font-bold">O</span>
        </div>
        <h1 className="text-3xl font-bold text-text-primary">OpenSeat</h1>
        <p className="text-text-secondary mt-2">
          Your open seat is waiting
        </p>
      </div>

      <p className="text-text-secondary max-w-sm mb-10">
        Exclusive carpooling for your community. Share rides with verified
        people and meet someone new.
      </p>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Link href="/login" className="btn-primary text-center">
          Get Started
        </Link>
      </div>

      <p className="text-text-tertiary text-xs mt-12">
        Verified by your university
      </p>
    </div>
  );
}
