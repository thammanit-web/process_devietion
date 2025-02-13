'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";

export default function Nav() {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || pathname.startsWith('/login')) {
    return null;
  }

  const handleSignOut = async () => {
    const result = await signOut({ redirect: false, callbackUrl: "/" });
    if (result) {
      router.push('/login');
    }
  };

  return (
    <nav className="flex items-center justify-between text-black w-full h-30 shadow-md"
      style={{
        backgroundImage:
          "url('https://media.istockphoto.com/id/1063503470/vector/wood-texture-wood-background-vector-pattern-with-wood-lines.jpg?s=612x612&w=0&k=20&c=t1WPGX98AUxkPmHkGru3pJMsjUJM4u4TeO-x1dNQQP4=')",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',

      }}>
      <div className='flex w-screen h-24 justify-between'>
        <div className="shrink-0 mt-4 ms-6">
          <a href="/" className='mt-4'>
            <img className="w-14" src="https://www.thainitrate.com/images/tnc-logo.png" alt="ChitChat Logo" />
          </a>
        </div>
        <div className='flex justify-center items-center w-full'>
          <div className=' text-black text-center mt-4 '>
            <p className='lg:text-3xl md:text-xl sm:text-xs'>PROCESS DEVIATION INVESTIGATION FORM</p>
            <p className='flex justify-center'>รายงานความผิดปกติในกระบวนการผลิต</p>
          </div>
        </div>

        <div className='place-items-center grid px-2'>
            <button onClick={handleSignOut} className='border px-2 py-2 w-20 border-red-500 text-red-500 rounded-xl hover:border-red-800 hover:text-red-800'>
              sign out
            </button>
          </div>
      </div>

    </nav>
  );
}
