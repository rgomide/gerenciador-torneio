'use client'
import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { DialogClose } from '@radix-ui/react-dialog';
import { createInstitution, formatDate, getInstitutions } from '@/services/apiService';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


function page() {
  const [institutions, setInstitutions] = React.useState([])

  React.useEffect(() => {
    fetchInstitutions()
  }, [])

  const fetchInstitutions = async () => {
    try {
      const data = await getInstitutions()
      setInstitutions(data)
    } catch (e) {
      console.error(`Erro ao obter instituições: ${e}`);
    }
  }

  const formSchema = z.object({
    name: z.string().min(3, "O nome da Instituição deve ter pelo menos 3 caracteres"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values) {
    try {
      const success = createInstitution(values.name);

      if (success) {
        form.reset();
        toast.success("Instituição criada com sucesso!");
        await fetchInstitutions();
      }
    } catch (error) {
      toast.error("Erro ao criar instituição");
      console.error(error);
    }
  }

  return (
    <div className='flex flex-col h-screen w-full p-12 gap-8'>
      <h1>Instituições</h1>

      <Table className='w-full'>
        <TableCaption>Lista de Instituições cadastradas no sistema</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Nome</TableHead>
            <TableHead>Data de registro</TableHead>
            <TableHead>Última atualização</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {institutions.map((institution) => (
            <TableRow key={institution.id}>
              <TableCell className="font-medium">{institution.name}</TableCell>
              <TableCell className="font-medium">{formatDate(institution.createdAt)}</TableCell>
              <TableCell className="font-medium">{formatDate(institution.updatedAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog>
        <DialogTrigger asChild>
          <Button className='bg-emerald-600 hover:bg-emerald-700 w-full'>Adicionar nova Instituição</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nova Instituição</DialogTitle>
            <DialogDescription>
              Preencha os dados corretamente, as Instituições podem ser editadas posteriormente mas não podem ser excluidas do sistema.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Instituição</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da instituição" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogTrigger asChild>
                <Button type={'submit'}>Salvar</Button>
              </DialogTrigger>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default page