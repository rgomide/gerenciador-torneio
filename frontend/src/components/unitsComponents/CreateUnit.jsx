import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { createUnit } from '@/services/apiService'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'

function CreateUnit({ fetchFunction, institutionId }) {
  const formSchema = z.object({
    name: z.string().min(3, "O nome da Unidade deve ter pelo menos 3 caracteres"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values) {
    try {
      const resp = await createUnit(values.name, institutionId);
  
      if (!resp || resp.error) {
        throw new Error(resp?.error || "Erro ao criar Unidade");
      }
  
      form.reset();
      toast.success("Unidade criada com sucesso!");
      await fetchFunction();
    } catch (error) {
      console.error("Erro na criação:", error);
      toast.error(error.message || "Erro ao criar unidade");
    }
  }
  

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' size='icon' className='bg-emerald-500 hover:bg-emerald-700'>
          <Plus/>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova Unidade</DialogTitle>
          <DialogDescription>
            Preencha os dados corretamente, as Unidades podem ser editadas posteriormente mas não podem ser excluidas do sistema.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da unidade</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da unidade" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogTrigger asChild>
              <Button type={'submit'} className='bg-emerald-600 hover:bg-emerald-700'>Salvar</Button>
            </DialogTrigger>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateUnit