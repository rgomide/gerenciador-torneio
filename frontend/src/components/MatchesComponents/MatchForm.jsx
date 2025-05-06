import Spinner from '@/components/common/Spinner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { formatDateTimeToInput } from '@/services/dateUtil'
import useApi from '@/services/useApi'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil, Plus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

function MatchForm({ record, onClose, tournament }) {
  const [isOpen, setIsOpen] = useState(false)
  const [match, _] = useState(record)

  const { createMatch, updateMatch, isLoading } = useApi()

  const isCreate = record === undefined

  const formSchema = z.object({
    description: z.string().min(3, 'O nome da Partida deve ter pelo menos 3 caracteres'),
    date: z.coerce.date(),
    location: z.string().min(3, 'O local da partida deve ter pelo menos 3 caracteres'),
    roundNumber: z.coerce.number().min(1, 'O número da rodada deve ser maior que 0'),
    occurrences: z.optional(z.string().min(3, 'As ocorrências devem ter pelo menos 3 caracteres'))
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: match?.description || '',
      date: match?.date
        ? formatDateTimeToInput(new Date(match.date))
        : formatDateTimeToInput(new Date()),
      location: match?.location || '',
      roundNumber: match?.roundNumber || '',
      occurrences: match?.occurrences || ''
    }
  })

  const handleSubmit = async (event) => {
    event.preventDefault()

    await form.trigger()

    if (form.formState.isValid) {
      form.handleSubmit(isCreate ? onSubmitCreate : onSubmitUpdate)()
    }
  }

  const onSubmitCreate = async (data) => {
    const response = await createMatch(data)

    if (response.requestSuccessful) {
      closeDialog()
      toast.success('Partida criada com sucesso!')
    } else {
      toast.error(response.error)
    }
  }

  const onSubmitUpdate = async (data) => {
    const response = await updateMatch(match.id, data)

    if (response.requestSuccessful) {
      closeDialog()
      toast.success('Partida editada com sucesso!')
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isCreate ? 'Criar Partida' : 'Editar Partida'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Descrição" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Local</FormLabel>
                  <FormControl>
                    <Input placeholder="Local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roundNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número da Rodada</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Número da Rodada" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="occurrences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ocorrências</FormLabel>
                  <FormControl>
                    <Input placeholder="Ocorrências" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogTrigger asChild>
              <Button
                disabled={isLoading}
                onClick={handleSubmit}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isLoading && <Spinner size="sm" color="gray" />}
                Salvar
              </Button>
            </DialogTrigger>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default MatchForm
