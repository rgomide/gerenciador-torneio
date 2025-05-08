import useApi from '@/services/useApi'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil, Plus } from 'lucide-react'
import { useState } from 'react'
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
  const [isOpen, setIsOpen] = useState(false)
  const [institution, setInstitution] = useState(record)

  const { createInstitution, updateInstitution } = useApi()
  const isCreate = record === undefined

  const formSchema = z.object({
    name: z.string().min(3, 'O nome da Instituição deve ter pelo menos 3 caracteres')
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: institution?.name || ''
    }
  })

  const handleSubmit = async (event) => {
    event.preventDefault()

    const isValid = await form.trigger()

    if (isValid) {
      form.handleSubmit(isCreate ? onSubmitCreate : onSubmitUpdate)()
    }
  }

  async function onSubmitCreate(values) {
    const response = await createInstitution(values.name)

    if (response.requestSuccessful) {
      toast.success('Instituição criada com sucesso!')
      closeDialog()
    } else {
      toast.error(response.error)
    }
  }

  async function onSubmitUpdate(values) {
    const response = await updateInstitution(record.id, values.name)

    if (response.requestSuccessful) {
      toast.success('Instituição editada com sucesso!')
      closeDialog()
    } else {
      toast.error(response.error)
    }
  }

  const closeDialog = () => {
    onClose?.()
    handleOpenChange(false)
  }

  const handleOpenChange = (open) => {
    setIsOpen(open)
    if (!open) {
      form.reset()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {isCreate ? (
          <Button variant="outline" className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus className="h-4 w-4" />
            Inserir
          </Button>
        ) : (
          <Button variant="outline">
            <Pencil />
            Editar
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
          <form className="flex flex-col gap-4">
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
              <Button onClick={handleSubmit} className="bg-emerald-600 hover:bg-emerald-700">
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
