'use client'
import { formatDateToInput } from '@/services/dateUtil'
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

function EventsForm({ record, onClose, unitId }) {
  const [isOpen, setIsOpen] = useState(false)
  const [event] = useState(record)

  const { createEvent, updateEvent } = useApi()
  const isCreate = record === undefined

  const formSchema = z.object({
    name: z.string().min(3, 'O nome do Evento deve ter pelo menos 3 caracteres'),
    startDate: z.coerce.date(),
    endDate: z.coerce.date()
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: event?.name || '',
      startDate: event?.startDate
        ? formatDateToInput(new Date(event.startDate))
        : formatDateToInput(new Date()),
      endDate: event?.endDate
        ? formatDateToInput(new Date(event.endDate))
        : formatDateToInput(new Date())
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
    const response = await createEvent(values.name, unitId, values.startDate, values.endDate)

    if (response.requestSuccessful) {
      toast.success('Evento criado com sucesso!')
      closeDialog()
    } else {
      toast.error(response.error)
    }
  }

  async function onSubmitUpdate(values) {
    const response = await updateEvent(
      record.id,
      values.name,
      record.unitId,
      values.startDate,
      values.endDate
    )

    if (response.requestSuccessful) {
      closeDialog()
      toast.success('Evento editado com sucesso!')
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
          <DialogTitle>{isCreate ? 'Criar ' : 'Editar '} Evento</DialogTitle>
          <DialogDescription>Preencha os dados corretamente.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do evento</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do evento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de início</FormLabel>
                  <input
                    type="date"
                    className="rounded-sm bg-gray-100 p-2"
                    placeholder="Data de início"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-4">
                  <FormLabel>Data de término</FormLabel>
                  <input
                    type="date"
                    className="rounded-sm bg-gray-100 p-2"
                    placeholder="Data de término"
                    {...field}
                  />
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

export default EventsForm
