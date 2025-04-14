'use client'
import { createTournament, updateTournament } from '@/services/apiService'
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

function TournamentsForm({ record, onClose, eventId }) {
  const isCreate = record === undefined

  const formSchema = z.object({
    name: z.string().min(3, 'O nome do Torneio deve ter pelo menos 3 caracteres'),
    startDate: z.string().min(1, 'A data de início é obrigatória'),
    endDate: z.string().min(1, 'A data de término \é obrigatória')
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      startDate: record?.startDate || '',
      endDate: record?.endDate || ''
    }
  })

  async function onSubmitCreate(values) {
    try {
      const resp = await createTournament(values.name, eventId, values.startDate, values.endDate)

      if (!resp || resp.error) {
        throw new Error(resp?.error || 'Erro ao criar torneio')
      }

      form.reset()
      toast.success('Torneio criado com sucesso!')
      if (onClose) {
        onClose()
      }
    } catch (error) {
      console.error('Erro na criação:', error)
      toast.error(error.message || 'Erro ao criar torneio')
    }
  }

  async function onSubmitUpdate(values) {
    try {
      const resp = await updateTournament(
        record.id,
        values.name,
        record.eventId,
        values.startDate,
        values.endDate
      )

      if (!resp || resp.error) {
        throw new Error(resp?.error || 'Erro ao editar torneio')
      }

      form.reset()
      toast.success('Torneio editado com sucesso!')
      if (onClose) {
        onClose()
      }
    } catch (error) {
      console.error('Erro ao editar:', error)
      toast.error(error.message || 'Erro ao editar torneio')
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
          <DialogTitle>{isCreate ? 'Criar ' : 'Editar '} Torneio</DialogTitle>
          <DialogDescription>Preencha os dados corretamente.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={
              isCreate ? form.handleSubmit(onSubmitCreate) : form.handleSubmit(onSubmitUpdate)
            }
            className="flex flex-col gap-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Torneio</FormLabel>
                  <FormControl>
                    <Input placeholder={isCreate ? 'Nome do torneio' : record.name} {...field} />
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

export default TournamentsForm
