import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { createInstitution, updateInstitution } from '@/services/apiService'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil } from 'lucide-react'

function UpdateInstitution({ prevName, id, fetchFunction }) {
  const formSchema = z.object({
    name: z.string().min(3, "O nome da Instituição deve ter pelo menos 3 caracteres"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: prevName,
    },
  });

  async function onSubmit(values) {
    try {
      const resp = await updateInstitution(id, values.name);

      if (!resp || resp.error) {
        throw new Error(resp?.error || "Erro ao editar instituição");
      }

      form.reset();
      toast.success("Instituição editada com sucesso!");
      await fetchFunction();
    } catch (error) {
      toast.error("Erro ao editar instituição");
      console.error(error);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='hover:bg-gray-200' variant='outline' size='icon'>
          <Pencil/>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Instituição</DialogTitle>
          <DialogDescription>
            Edite os dados corretamente, as Instituições podem ser editadas posteriormente mas não podem ser excluidas do sistema.
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
                    <Input placeholder={prevName} {...field} />
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

export default UpdateInstitution