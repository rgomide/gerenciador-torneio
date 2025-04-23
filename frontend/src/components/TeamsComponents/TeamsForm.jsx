'use client'
import { createTeam, createUnit, getSports, updateTeam, updateUnit } from '@/services/apiService'
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
import { useState } from 'react'
import SelectSearcher from '../common/SelectSearcher'

function TeamsForm({ record, unitId, onClose }) {
  const [selectedSport, setSelectedSport] = useState(record?.sport)

  const isCreate = record === undefined

  const formSchema = z.object({
    name: z.string().min(3, 'O nome da equipe deve ter pelo menos 3 caracteres'),
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    }
  })

  async function onSubmitCreate(values) {
    try {
      const resp = await createTeam(values.name, unitId, selectedSport?.id)

      if (!resp || resp.error) {
        throw new Error(resp?.error || 'Erro ao criar equipe')
      }

      form.reset()
      toast.success('Equipe criada com sucesso!')
      if (onClose) {
        onClose()
      }
    } catch (error) {
      console.error('Erro na criação:', error)
      toast.error(error.message || 'Erro ao criar equipe')
    }
  }

  async function onSubmitUpdate(values) {
    try {
      const resp = await updateTeam(record.id, values.name)

      if (!resp || resp.error) {
        throw new Error(resp?.error || 'Erro ao editar equipe')
      }

      form.reset()
      toast.success('Equipe editada com sucesso!')
      if (onClose) {
        onClose()
      }
    } catch (error) {
      console.error('Erro ao editar:', error.error)
      toast.error(error.error || 'Erro ao editar equipe')
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
          <DialogTitle>{isCreate ? 'Criar ' : 'Editar '} Equipe</DialogTitle>
          <DialogDescription>
            Preencha os dados corretamente.
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
                  <FormLabel>Nome da equipe</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={isCreate ? 'Nome da equipe' : record.name}
                      {...field}
                    />
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
                      labelField='name'
                      idField='id'
                      placeholder='Selecione o esporte correspondente'
                      minCharacters={2}
                      onLoad={getSports}
                      value={record?.sport}
                      onChange={setSelectedSport}
                    />
                  </FormControl>
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

export default TeamsForm
