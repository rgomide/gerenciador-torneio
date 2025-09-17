'use client'

import useApi from '@/services/useApi'
import { DialogDescription } from '@radix-ui/react-dialog'
import { FileUser, Goal, Minus, MinusCircle, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import Spinner from '../common/Spinner'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select'
import { Label } from '../ui/label'
import SelectSearcher from '../common/SelectSearcher'
import { toast } from 'sonner'

function MatchScoreForm({ record: matchRecord }) {
  const [participants, setParticipants] = useState([])
  const [selectedParticipant, setSelectedParticipant] = useState(null)
  const [score, setScore] = useState(0)

  const { getMatchParticipants, addScoreToMatch, isLoading } = useApi()

  const fetchParticipants = async (p) => {
    const response = await getMatchParticipants(matchRecord.id)
    const formattedData = response.data.map((participant) => ({
      label: participant.team?.name || participant.player?.name,
      value: participant.id,
    }))

    if (response.requestSuccessful) {
      setParticipants(formattedData)

      return formattedData
    } else {
      toast.error(response.error)
    }
  }

  useEffect(() => {
    fetchParticipants()
  }, [])

  const handleScore = (buttonType) => {
    if (buttonType === 'remove' && score > 0) {
      setScore(score - 1)
    } else if (buttonType !== 'remove') {
      setScore(score + 1)
    }
  }

  const saveScore = async () => {
    const resp = await addScoreToMatch(matchRecord.id, participants.value, )
  }

  return (
    <Dialog onOpenChange={(isOpen) => isOpen && fetchParticipants()}>
      <DialogTrigger asChild>
        <Button>
          <Goal />
          Pontuação
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pontuações da partida</DialogTitle>
          <DialogDescription>Adicione ou remova pontos à partida.</DialogDescription>
        </DialogHeader>

        <div className='flex flex-col gap-4'>
          <div className='flex gap-8'>
            <h1 className='text-3xl'>Pontos: <span className='text-emerald-600 font-bold'>{score}</span> </h1>
            <div className='flex gap-2'>
              <Button onClick={handleScore}>
                <Plus />
              </Button>
              <Button onClick={() => handleScore('remove')}>
                <Minus />
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4 w-full">
            <Label>Jogador ou time</Label>
            <SelectSearcher
              labelField='label'
              placeholder="Selecione"
              minCharacters={2}
              onLoad={fetchParticipants}
              value={selectedParticipant}
              onChange={setSelectedParticipant}
            />
          </div>

          <Button
            onClick={saveScore}
            disabled={isLoading || !selectedParticipant}>
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
            participants.map((participant) => (
              <div key={participant.id} className="border p-2 my-2 rounded flex justify-between items-center">
                <p className="font-medium">
                  {participant.participantType === 'team'
                    ? participant.team?.name
                    : participant.player?.name}
                </p>
                <Button
                  variant='destructive'
                  size='icon'
                  onClick={() => removeParticipant(participant.id)}
                >
                  <MinusCircle />
                </Button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default MatchScoreForm
