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
import { useEffect, useState } from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select'

function TeamsForm({ record, unitId, onClose }) {
  const [sports, setSports] = useState([])

  useEffect(() => {
    fetchSports()
  }, [])

  const fetchSports = async () => {
    try {
      const data = await getSports()
      setSports(data)
    } catch (e) {
      console.error(`Erro ao obter esportes: ${e}`)
    }
  }

  const isCreate = record === undefined

  const formSchema = z.object({
    name: z.string().min(3, 'O nome da equipe deve ter pelo menos 3 caracteres'),
    sportId: z.string().min(1, 'Selecione um esporte')
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      sportId: ''
    }
  })

  async function onSubmitCreate(values) {
    try {
      const resp = await createTeam(values.name, unitId, values.sportId)

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
              name="sportId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a modalidade correspondente"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Esportes</SelectLabel>
                      {sports.map((sport) => (
                        <SelectItem key={sport.id} value={sport.id}>
                          {sport.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
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
