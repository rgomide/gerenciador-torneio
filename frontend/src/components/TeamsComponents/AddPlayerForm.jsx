'use client'
import useApi from '@/services/useApi'
import { zodResolver } from '@hookform/resolvers/zod'
import { FileUser, Pencil, Plus, Trash2, X } from 'lucide-react'
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
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { ScrollArea } from '../ui/scroll-area'

function AddPlayerForm({ unitId, onClose, teamId }) {
  const { getPlayersByUnitId, addPlayersToTeam } = useApi()
  const [selectedPlayers, setSelectedPlayers] = useState([{ player: null, details: '' }])

  const handleChange = (index, field, value) => {
    const updatedPlayres = [...selectedPlayers]
    updatedPlayres[index][field] = value
    setSelectedPlayers(updatedPlayres)
  }

  const addField = () => {
    setSelectedPlayers([...selectedPlayers, { player: null, details: '' }])
  }

  const removeField = (index) => {
    const updatedPlayers = selectedPlayers.filter((_, i) => i !== index)
    setSelectedPlayers(updatedPlayers)
  }

  const handleSave = async () => {
    const formattedPlayers = selectedPlayers
      .filter(p => p.player?.id) // evita enviar nulls
      .map(({ player, details }) => ({
        id: player.id,
        details,
      }))
  
    try {
      await addPlayersToTeam(teamId, formattedPlayers)
      toast.success('Jogadores adicionados com sucesso!')
      onClose?.()
    } catch (error) {
      console.error(error)
      toast.error('Erro ao salvar jogadores.')
    }
  }
  

  async function fetchPlayers() {
    const response = await getPlayersByUnitId(unitId)
    if (response.requestSuccessful) {
      return response.data
    }
    return []
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon">
          <FileUser className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Adicionar jogadores</DialogTitle>
          <DialogDescription>Adicione atletas e observações abaixo.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <ScrollArea className='max-h-[300px]'>
            {selectedPlayers.map((entry, index) => (
              <div key={index} className="border p-4 rounded-md space-y-2 flex flex-col gap-2">
                <div className='flex flex-col gap-4'>
                  <Label>Atleta</Label>
                  <SelectSearcher
                    labelField="name"
                    idField="id"
                    placeholder="Selecione o atleta"
                    minCharacters={2}
                    onLoad={fetchPlayers}
                    onChange={(value) => handleChange(index, 'player', value)}
                  />
                </div>

                <div className='flex flex-col gap-4'>
                  <Label>Observação</Label>
                  <Input
                    placeholder="Observação"
                    value={entry.details}
                    onChange={(e) => handleChange(index, 'details', e.target.value)}
                  />
                </div>

                <div>
                  {selectedPlayers.length > 1 && (
                    <Button variant="outline" className='text-red-500 hover:text-white hover:bg-red-500' onClick={() => removeField(index)}>
                      <X />
                      Remover atleta
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </ScrollArea>

          <Button onClick={addField}>
            + Adicionar jogador
          </Button>

          <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            Salvar jogadores
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddPlayerForm
