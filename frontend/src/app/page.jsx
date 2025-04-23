'use client'

import OverlaySpinner from '@/components/common/OverlaySpinner'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { sha256 } from '@/services/cryptoUtil'
import useApi from '@/services/useApi'
import { zodResolver } from '@hookform/resolvers/zod'
import { getCookie, setCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export default function Home() {
  const router = useRouter()
  const { auth, isLoading } = useApi()
  useEffect(() => {
    const token = getCookie('token')
    if (token) {
      router.replace('/private/dashboard')
    }
  }, [])

  const formSchema = z.object({
    username: z.string().min(3, 'Preencha corretamente seu username'),
    password: z.string().min(3, 'Preencha a senha corrretamente')
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  })

  async function onSubmit(values) {
    const passwordHash = await sha256(values.password)
    const resp = await auth(values.username, passwordHash)

    if (resp.requestSuccessful) {
      const token = resp.data.token
      setCookie('token', token, { maxAge: 60 * 60 * 24, path: '/', secure: true, httpOnly: false })

      toast.success('Login realizado com sucesso!')
      router.replace('/private/dashboard')
    } else {
      toast.error(resp.error)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {isLoading && <OverlaySpinner />}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Entre com suas credenciais</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome de usuário</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome de usuário" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type={'password'} placeholder="Sua senha" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-600 cursor-pointer"
              >
                Entrar
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-500">© 2025</p>
        </CardFooter>
      </Card>
    </main>
  )
}
