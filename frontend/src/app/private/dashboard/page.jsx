'use client'
import { Button } from '@/components/ui/button';
import { deleteCookie, getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { toast } from 'sonner';

function page() {
  const router = useRouter();

  useEffect(() => {
    const token = getCookie("token");

    if (!token) {
      router.push("/");
    }

    toast.success("Login realizado com sucesso!");
  }, []);

  const deleteSession = () => {
    deleteCookie("token", { path: "/" });
    toast.success("Sessão encerrada com sucesso!")
    router.push("/");
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-24'>
      <Button onClick={deleteSession}>press me to logout</Button>
    </div>
  )
}

export default page