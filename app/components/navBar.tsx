'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Nav() {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || pathname.startsWith('/login') || pathname === '/') {
    return null;
  }

  const handleLogout = async () => {
    const response = await fetch('/api/auth/logout', { method: 'POST' });

    if (response.ok) {
      router.push('/login');
    } else {
      console.error('Failed to logout');
    }
  };

  return (
    <nav className="flex items-center justify-between text-black w-full h-30 shadow-md">
      <div className='flex w-screen h-24 justify-between'>
        <div className="shrink-0 mt-4 ms-6">
          <a href="/">
            <img className="w-14" src="https://www.thainitrate.com/images/tnc-logo.png" alt="ChitChat Logo" />
          </a>
        </div>
        <div className='flex justify-center items-center flex-1'>
          <div className=' text-black text-center mt-4 '>
            <h1 className='lg:text-3xl md:text-xl sm:text-xs'>PROCESS DEVIATION INVESTIGATION FORM</h1>
            <h1>รายงานความผิดปกติในกระบวนการผลิต</h1>
          </div>
        </div>
      </div>

    </nav>
  );
}
