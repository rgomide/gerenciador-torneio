'use client'
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

function page() {
  const router = useRouter();

  useEffect(() => {
    const token = getCookie("token");

    if (!token) {
      router.replace("/");
    }
  }, []);

  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-24'>
      <p>Tela dashboard</p>
    </div>
  )
}

export default page