'use client'

import useApi from '@/services/useApi'
import { DialogDescription } from '@radix-ui/react-dialog'
import { FileUser, MinusCircle, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import SelectSearcher from '../common/SelectSearcher'
import Spinner from '../common/Spinner'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Label } from '../ui/label'
import { ScrollArea } from '../ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '../ui/select'

function ParticipantsForm({ record: matchRecord }) {
  const [participants, setParticipants] = useState([])
  const [participantType, setParticipantType] = useState('')
  const [, setTeams] = useState([])
  const [, setPlayers] = useState([])
  const [selectedParticipant, setSelectedParticipant] = useState(null)

  const {
    getAllTeams,
    getAllPlayers,
    getMatchParticipants,
    addParticipant,
    deleteMatchParticipant,
    isLoading
  } = useApi()

  const fetchParticipants = async () => {
    const response = await getMatchParticipants(matchRecord.id)

    if (response.requestSuccessful) {
      setParticipants(response.data)
      return response.data
    } else {
      toast.error(response.error)
    }
  }

  const fetchPlayers = async () => {
    const response = await getAllPlayers()

    if (response.requestSuccessful) {
      setPlayers(response.data)
      return response.data
    } else {
      toast.error(response.error)
    }
  }

  const fetchTeams = async () => {
    const response = await getAllTeams()

    if (response.requestSuccessful) {
      setTeams(response.data)
      return response.data
    } else {
      toast.error(response.error)
    }
  }

  const createParticipant = async () => {
    const resp = await addParticipant(
      participantType,
      participantType === 'team' ? selectedParticipant.id : null,
      participantType === 'player' ? selectedParticipant.id : null,
      matchRecord.id
    )
    return resp.requestSuccessful ? fetchParticipants() : toast.error(resp.error)
  }

  const removeParticipant = async (participantId) => {
    const resp = await deleteMatchParticipant(matchRecord.id, participantId)
    return resp.requestSuccessful ? fetchParticipants() : toast.error(resp.error)
  }

  useEffect(() => {
    fetchParticipants()
  }, [])

  return (
    <Dialog onOpenChange={(isOpen) => isOpen && fetchParticipants()}>
      <DialogTrigger asChild>
        <Button>
          <FileUser />
          Participantes
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Participantes da partida</DialogTitle>
          <DialogDescription>Adicionar participantes à partida.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <Select onValueChange={(value) => setParticipantType(value)} value={participantType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Tipo do participante" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Escolha</SelectLabel>
                <SelectItem value="team">Time</SelectItem>
                <SelectItem value="player">Jogador</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <div className="flex flex-col gap-4 w-full">
            <Label>{participantType === 'team' ? 'Time' : 'Jogador'}</Label>
            <SelectSearcher
              labelField="name"
              placeholder="Selecione"
              minCharacters={2}
              onLoad={participantType === 'team' ? fetchTeams : fetchPlayers}
              value={selectedParticipant}
              onChange={setSelectedParticipant}
            />
          </div>

          <Button
            onClick={createParticipant}
            disabled={isLoading || !participantType || !selectedParticipant}
          >
            <Plus />
            Adicionar
          </Button>
        </div>

        <div>
          <h1 className="font-bold">Lista de participantes</h1>
          {isLoading ? (
            <div className="flex justify-center items-center w-full my-4">
              <Spinner />
            </div>
          ) : (
            <ScrollArea className="w-full h-48">
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className="border p-2 my-2 rounded flex justify-between items-center"
                >
                  <p className="font-medium">
                    {participant.participantType === 'team'
                      ? participant.team?.name
                      : participant.player?.name}
                  </p>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeParticipant(participant.id)}
                  >
                    <MinusCircle />
                  </Button>
                </div>
              ))}
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ParticipantsForm
