import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil, Plus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

function MatchForm({ record, onClose, tournament }) {
  const [isOpen, setIsOpen] = useState(false)
  const [match, setMatch] = useState(record)

  const isCreate = record === undefined

  const formSchema = z.object({
    name: z.string().min(3, 'O nome da Partida deve ter pelo menos 3 caracteres')
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: match?.name || ''
    }
  })

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
      </DialogContent>
    </Dialog>
  )
}

export default MatchForm
