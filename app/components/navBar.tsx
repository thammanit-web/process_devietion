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

  if (!isClient || pathname.startsWith('/login')) {
    return null;
  }

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
          <a href="/">
            <img className="w-14" src="https://www.thainitrate.com/images/tnc-logo.png" alt="ChitChat Logo" />
          </a>
        </div>
        <div className='flex justify-center items-center w-full'>
          <div className=' text-black text-center mt-4 '>
            <p className='lg:text-3xl md:text-xl sm:text-xs'>PROCESS DEVIATION INVESTIGATION FORM</p>
            <p className='flex justify-start'>รายงานความผิดปกติในกระบวนการผลิต</p>
          </div>
        </div>
      </div>

    </nav>
  );
}
