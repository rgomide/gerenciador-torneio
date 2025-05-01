'use client'
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
  const [event, setEvent] = useState(record)

  const { createEvent, updateEvent } = useApi()
  const isCreate = record === undefined

  const formSchema = z.object({
    name: z.string().min(3, 'O nome do Evento deve ter pelo menos 3 caracteres'),
    startDate: z.string().min(1, 'A data de início é obrigatória'),
    endDate: z.string().min(1, 'A data de término \é obrigatória')
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: event?.name || '',
      startDate: event?.startDate || '',
      endDate: event?.endDate || ''
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
          <DialogTitle>{isCreate ? 'Criar ' : 'Editar '} Evento</DialogTitle>
          <DialogDescription>Preencha os dados corretamente.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="flex flex-col gap-4 space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do evento</FormLabel>
                  <FormControl>
                    <Input placeholder={isCreate ? 'Nome do evento' : record.name} {...field} />
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
                    placeholder={isCreate ? null : record.startDate}
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
                <FormItem className="flex flex-col">
                  <FormLabel>Data de término</FormLabel>
                  <input
                    type="date"
                    className="rounded-sm bg-gray-100 p-2"
                    placeholder={isCreate ? null : record.endDate}
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
