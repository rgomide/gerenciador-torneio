'use client'
import useApi from '@/services/useApi'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil, Plus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import SelectSearcher from '../common/SelectSearcher'
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
import Spinner from '../common/Spinner'

function TournamentsForm({ record, onClose, eventId }) {
  const [isOpen, setIsOpen] = useState(false)
  const [tournament, setTournament] = useState(record)

  const { getSports, createTournament, updateTournament, finishTournament, isLoading } = useApi()

  const isCreate = record === undefined

  const [selectedSport, setSelectedSport] = useState(record?.sport)

  const formSchema = z.object({
    name: z.string().min(3, 'O nome do Torneio deve ter pelo menos 3 caracteres'),
    startDate: z.string().min(1, 'A data de início é obrigatória'),
    endDate: z.string().min(1, 'A data de término \é obrigatória')
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: tournament?.name || '',
      startDate: tournament?.startDate || '',
      endDate: tournament?.endDate || ''
    }
  })

  const fetchSports = async (searchTerm) => {
    const response = await getSports({ name: searchTerm })
    if (response.requestSuccessful) {
      return response.data
    } else {
      toast.error(response.error)
      return []
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const isValid = await form.trigger()

    if (isValid) {
      form.handleSubmit(isCreate ? onSubmitCreate : onSubmitUpdate)()
    }
  }

  async function onSubmitCreate(values) {
    const sportId = selectedSport?.id

    const response = await createTournament(
      values.name,
      eventId,
      values.startDate,
      values.endDate,
      sportId
    )

    if (response.requestSuccessful) {
      closeDialog()
      toast.success('Torneio criado com sucesso!')
    } else {
      toast.error(response.error)
    }
  }

  async function onSubmitUpdate(values) {
    const sportId = selectedSport?.id

    const response = await updateTournament(
      record.id,
      values.name,
      record.eventId,
      values.startDate,
      values.endDate,
      sportId
    )

    if (response.requestSuccessful) {
      closeDialog()
      toast.success('Torneio editado com sucesso!')
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

  const handleFinishTournament = async () => {
    const resp = await finishTournament(record.id)
    if (resp.requestSuccessful) {
      closeDialog()
      toast.success('Torneio finalizado com sucesso!')
    } else {
      toast.error(resp.error)
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
          <DialogTitle>{isCreate ? 'Criar ' : 'Editar '} Torneio</DialogTitle>
          <DialogDescription>Preencha os dados corretamente.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Torneio</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do torneio" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sport"
              render={() => (
                <FormItem>
                  <FormLabel>Esporte</FormLabel>
                  <FormControl>
                    <SelectSearcher
                      labelField="name"
                      idField="id"
                      placeholder="Selecione o esporte"
                      minCharacters={2}
                      onLoad={fetchSports}
                      value={record?.sport}
                      onChange={setSelectedSport}
                    />
                  </FormControl>
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
                <FormItem className="flex flex-col">
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
              <Button
                disabled={isLoading}
                onClick={handleFinishTournament}
                variant='outline'
              >
                {isLoading && <Spinner size="sm" color="gray" />}
                Encerrar Torneio
              </Button>
            </DialogTrigger>

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

export default TournamentsForm
