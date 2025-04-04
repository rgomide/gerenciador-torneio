'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button";
import axios from "axios";
import { getCookie, setCookie } from "cookies-next";
import { useEffect } from "react";
import { toast } from "sonner";
import { auth } from "@/services/apiService";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = getCookie("token");
    if (token) {
      router.replace("/private/dashboard")
    }
  }, [])

  const formSchema = z.object({
    username: z.string().min(3, "Preencha corretamente seu username"),
    password: z.string().min(3, "Preencha a senha corrretamente"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: ""
    },
  });

  async function onSubmit(values) {
    const success = auth(values.username, values.password)

    if (success) {
      router.push("/private/dashboard")
      toast.success("Login realizado com sucesso!");
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
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
              <Button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-600 cursor-pointer">Entrar</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-500">© 2025</p>
        </CardFooter>
      </Card>
    </main>
  );
}