"use client";
import React, { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function LoginCardContent() {
  const [employee_email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employee_email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);
        router.push(next || "/");
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleHome = async () => {
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-center mb-6">Login</h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-4 border rounded-md"
            value={employee_email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-2 mb-6 border rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-2 top-2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button
            type="submit"
            className={`w-full mb-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded`}
            disabled={loading}
          >
            {loading ? "Login..." : "Login"}
          </button>
        </form>
        <button
          onClick={handleHome}
          className={`w-full mb-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded`}
          disabled={loading}
        >
          กลับหน้าแรก
        </button>
      </div>
    </div>
  );
}
