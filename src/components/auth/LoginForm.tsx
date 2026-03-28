"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, validateEmailDomain } from "@/lib/auth";
import { useAuth } from "@/lib/auth-context";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginForm() {
  const router = useRouter();
  const { isDemoMode } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (isDemoMode) {
      router.push("/home");
      return;
    }

    if (!validateEmailDomain(email)) {
      setError("Please use your @unc.edu or @email.unc.edu email");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      router.push("/home");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Email"
        type="email"
        placeholder="yourname@unc.edu"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && (
        <p className="text-error text-sm">{error}</p>
      )}
      <Button type="submit" loading={loading} className="w-full mt-2">
        Sign in
      </Button>
    </form>
  );
}
