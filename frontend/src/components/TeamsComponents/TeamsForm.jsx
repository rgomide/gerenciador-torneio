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

function TeamsForm({ record, unit, onClose }) {
  const [isOpen, setIsOpen] = useState(false)
  const [team, setTeam] = useState(record)
  const [selectedSport, setSelectedSport] = useState(record?.sport)

  const { getSports, createTeam, updateTeam } = useApi()

  const isCreate = record === undefined

  const formSchema = z.object({
    name: z.string().min(3, 'O nome da equipe deve ter pelo menos 3 caracteres')
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: team?.name || ''
    }
  })

  async function fetchSports(searchTerm) {
    const response = await getSports({ name: searchTerm })
    if (response.requestSuccessful) {
      return response.data
    }
    return []
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const isValid = await form.trigger()
    if (isValid) {
      form.handleSubmit(isCreate ? onSubmitCreate : onSubmitUpdate)()
    }
  }

  async function onSubmitCreate(values) {
    const resp = await createTeam(values.name, unit.id, selectedSport?.id)

    if (resp.requestSuccessful) {
      toast.success('Equipe criada com sucesso!')
      closeDialog()
    } else {
      toast.error(resp.error)
    }
  }

  async function onSubmitUpdate(values) {
    const resp = await updateTeam(team.id, values.name, unit.id, selectedSport?.id)

    if (resp.requestSuccessful) {
      toast.success('Equipe editada com sucesso!')
      closeDialog()
    } else {
      toast.error(resp.error)
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
          <DialogTitle>{isCreate ? 'Criar ' : 'Editar '} Equipe</DialogTitle>
          <DialogDescription>Preencha os dados corretamente.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da equipe</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da equipe" {...field} />
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
                      placeholder="Selecione o esporte correspondente"
                      minCharacters={2}
                      onLoad={fetchSports}
                      value={record?.sport}
                      onChange={setSelectedSport}
                    />
                  </FormControl>
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

export default TeamsForm
