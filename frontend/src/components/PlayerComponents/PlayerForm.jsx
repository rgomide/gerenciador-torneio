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

function PlayersForm({ record, onClose, unitId }) {
  const [isOpen, setIsOpen] = useState(false)
  const [player, setPlayer] = useState(record)

  const { createPlayer, updatePlayer } = useApi()
  const isCreate = record === undefined

  const formSchema = z.object({
    name: z.string().min(3, 'O nome do jogador deve ter pelo menos 3 caracteres'),
    email: z.string().min(3, 'O email deve ter pelo menos 3 caracteres, seguido por @ e .'),
    phone: z
      .string()
      .min(11, 'O número do jogador deve ter pelo menos 11 caracteres, incluindo o DDD')
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: player?.name || '',
      email: player?.email || '',
      phone: player?.phone || ''
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
    const response = await createPlayer(values.name, values.email, values.phone, unitId)

    if (response.requestSuccessful) {
      closeDialog()
      toast.success('Atleta criado com sucesso!')
    } else {
      toast.error(response.error)
    }
  }

  async function onSubmitUpdate(values) {
    const response = await updatePlayer(record.id, values.name, values.email, values.phone, unitId)

    if (response.requestSuccessful) {
      closeDialog()
      toast.success('Atleta editado com sucesso!')
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
          <DialogTitle>{isCreate ? 'Criar ' : 'Editar '} atleta</DialogTitle>
          <DialogDescription>Preencha os dados corretamente.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do atleta</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do atleta" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email do atleta</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email do atleta" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone do atleta</FormLabel>
                  <FormControl>
                    <Input type="phone" placeholder="(xx) xxxxx-xxxx" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogTrigger asChild>
              <Button
                type="button"
                onClick={handleSubmit}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Salvar
              </Button>
            </DialogTrigger>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default PlayersForm
