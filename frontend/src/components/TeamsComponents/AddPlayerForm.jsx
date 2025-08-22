'use client'
import useApi from '@/services/useApi'
import { FileUser, Save, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import SelectSearcher from '../common/SelectSearcher'
import Spinner from '../common/Spinner'
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

function AddPlayerForm({ unitId, onClose, team }) {
  const { getPlayersByUnitId } = useApi()
  const { isLoading, getPlayersByTeamId, addPlayersToTeam } = useApi()

  const [selectedPlayers, setSelectedPlayers] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  const teamId = team.id

  useEffect(() => {
    if (isOpen) {
      fetchTeamPlayers()
    }
  }, [isOpen])

  const fetchTeamPlayers = async () => {
    const response = await getPlayersByTeamId(teamId)

    if (response.requestSuccessful) {
      const teamPlayers = response.data.map((player) => {
        const details = player.teams?.find((team) => team.id == teamId)?.teamPlayer?.details

        console.log(player)
        console.log(teamId)

        return {
          details,
          player: {
            id: player.id,
            name: player.name
          }
        }
      })

      setSelectedPlayers(teamPlayers)
    } else {
      toast.error(response.error)
    }
  }

  const handleChange = (index, field, value) => {
    const updatedPlayres = [...selectedPlayers]
    updatedPlayres[index][field] = value
    setSelectedPlayers(updatedPlayres)
  }

  const addField = () => {
    setSelectedPlayers([{ player: null, details: '' }, ...selectedPlayers ])
  }

  const removeField = (index) => {
    const updatedPlayers = selectedPlayers.filter((_, i) => i !== index)
    setSelectedPlayers(updatedPlayers)
  }

  const handleSave = async (event) => {
    event.preventDefault()

    const formattedPlayers = selectedPlayers
      .filter((p) => p.player?.id)
      .map(({ player, details }) => ({
        id: player.id,
        details
      }))

    const response = await addPlayersToTeam(teamId, formattedPlayers)

    if (response.requestSuccessful) {
      toast.success('Salvo com sucesso!')
      handleClose(false)
    } else {
      toast.error(response.error)
    }
  }

  const handleClose = (value) => {
    setIsOpen(value)

    if (!value) {
      onClose?.()
    }
  }

  const fetchPlayers = async () => {
    const response = await getPlayersByUnitId(unitId)
    if (response.requestSuccessful) {
      return response.data
    }
    return []
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button>
          <FileUser className="h-4 w-4" />
          Gerenciar atletas
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[300px] md:min-w-[900px] h-4/5 overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>{team.name} - Adicionar jogadores</DialogTitle>
          <DialogDescription>Adicione atletas e observações abaixo.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className='flex gap-4 items-center'>
            <Button onClick={addField}>+ Adicionar jogador</Button>

            <DialogTrigger asChild>
              <Button
                disabled={isLoading}
                onClick={handleSave}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isLoading && <Spinner size="sm" color="gray" />}
                <Save /> Salvar jogadores
              </Button>
            </DialogTrigger>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center w-full my-4">
              <Spinner />
            </div>
          ) : (
            selectedPlayers.map((selectedPlayer, index) => (
              <div
                key={index}
                className="border p-4 rounded-md space-y-2 flex flex-col md:flex-row gap-2 mb-2 bg-gray-100"
              >
                <div className="flex flex-col gap-4 md:w-[500px]">
                  <Label>Atleta #{index + 1}</Label>
                  <SelectSearcher
                    labelField="name"
                    idField="id"
                    placeholder="Selecione o atleta"
                    minCharacters={2}
                    onLoad={fetchPlayers}
                    value={selectedPlayer.player}
                    onChange={(value) => handleChange(index, 'player', value)}
                  />
                </div>

                <div className="flex flex-col gap-4 w-[300px]">
                  <Label>Observação</Label>
                  <div className="flex flex-row gap-2">
                    <Input
                      placeholder="Observação"
                      className="w-full bg-white"
                      value={selectedPlayer.details ?? ''}
                      onChange={(e) => handleChange(index, 'details', e.target.value)}
                    />

                    {selectedPlayers.length > 1 && (
                      <Button
                        variant="outline"
                        className="text-red-500 hover:text-white hover:bg-red-500 cursor-pointer"
                        onClick={() => removeField(index)}
                      >
                        <Trash2 />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddPlayerForm
