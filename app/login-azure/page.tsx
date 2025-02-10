"use client";
import { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

export const LoginButton = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      router.push(next || '/');
    }
  }, [session, next, router]);

  const handleSignIn = async () => {
    await signIn('azure-ad', { redirect: false });
  };

  return (
    <div className="grid place-items-center h-screen">
      <div className="border px-20 py-20 border-gray-300 rounded-lg grid gap-10">
        <p className="text-3xl font-bold text-center">Sign in</p>
        <div className="w-full justify-center items-center flex mb-6">
          <img src="https://www.thainitrate.com/images/tnc-logo.png" className="w-16" alt="" />
        </div>
        <button
          onClick={handleSignIn}
          className="border border-blue-500
          rounded-xl text-white font-semibold bg-blue-500 hover:bg-blue-700 py-1">
          Sign in
        </button>
      </div>
    </div>

  );
};
