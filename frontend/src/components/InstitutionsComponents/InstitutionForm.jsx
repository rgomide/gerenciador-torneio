import useApi from '@/services/useApi'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil, Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'

function InstitutionForm({ record, onClose }) {
  const { createInstitution, updateInstitution } = useApi()
  const isCreate = record === undefined

  const formSchema = z.object({
    name: z.string().min(3, 'O nome da Instituição deve ter pelo menos 3 caracteres')
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: ''
    }
  })

  async function onSubmitCreate(values) {
    const response = await createInstitution(values.name)

    if (response.requestSuccessful) {
      form.reset()
      toast.success('Instituição criada com sucesso!')
      if (onClose) {
        onClose()
      }
    } else {
      toast.error(response.error)
    }
  }

  async function onSubmitUpdate(values) {
    const response = await updateInstitution(record.id, values.name)

    if (response.requestSuccessful) {
      form.reset()
      toast.success('Instituição editada com sucesso!')
      if (onClose) {
        onClose()
      }
    } else {
      toast.error(response.error)
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
            Preencha os dados corretamente, as Instituições podem ser editadas posteriormente mas
            não podem ser excluidas do sistema.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={
              isCreate ? form.handleSubmit(onSubmitCreate) : form.handleSubmit(onSubmitUpdate)
            }
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Instituição</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={isCreate ? 'Nome da instituição' : record.name}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogTrigger asChild>
              <Button type={'submit'} className="bg-emerald-600 hover:bg-emerald-700">
                Salvar
              </Button>
            </DialogTrigger>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default InstitutionForm
