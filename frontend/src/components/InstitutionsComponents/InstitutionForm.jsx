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
import { Pencil, Plus } from 'lucide-react'

function InstitutionForm({ record, onClose }) {
  const isCreate = record === undefined

  const formSchema = z.object({
    name: z.string().min(3, "O nome da Instituição deve ter pelo menos 3 caracteres"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmitCreate(values) {
    try {
      const resp = await createInstitution(values.name);

      if (!resp || resp.error) {
        throw new Error(resp?.error || "Erro ao criar instituição");
      }

      form.reset();
      toast.success("Instituição criada com sucesso!");
      if (onClose) {
        onClose()
      }
    } catch (error) {
      console.error("Erro na criação:", error);
      toast.error(error.message || "Erro ao criar instituição");
    }
  }

  async function onSubmitUpdate(values) {
    try {
      const resp = await updateInstitution(record.id, values.name);

      if (!resp || resp.error) {
        throw new Error(resp?.error || "Erro ao editar instituição");
      }

      form.reset();
      toast.success("Instituição editada com sucesso!");
      if (onClose) {
        onClose()
      }
    } catch (error) {
      toast.error("Erro ao editar instituição");
      console.error(error);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {isCreate ? (
          <Button variant="outline" className="bg-emerald-600 hover:bg-emerald-700" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="outline" size="icon">
            <Pencil />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isCreate ? 'Criar ' : 'Editar '} Instituição</DialogTitle>
          <DialogDescription>
            Preencha os dados corretamente, as Instituições podem ser editadas posteriormente mas não podem ser excluidas do sistema.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={isCreate ? form.handleSubmit(onSubmitCreate) : form.handleSubmit(onSubmitUpdate)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Instituição</FormLabel>
                  <FormControl>
                    <Input placeholder={isCreate ? "Nome da instituição" : record.name} {...field} />
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

export default InstitutionForm