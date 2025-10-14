'use client'

import useApi from '@/services/useApi'
import { DialogDescription } from '@radix-ui/react-dialog'
import { Goal, Minus, MinusCircle, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import SelectSearcher from '../common/SelectSearcher'
import Spinner from '../common/Spinner'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Label } from '../ui/label'
import { ScrollArea } from '../ui/scroll-area'

function MatchScoreForm({ record: matchRecord }) {
  const [participants, setParticipants] = useState([])
  const [selectedParticipant, setSelectedParticipant] = useState(null)
  const [score, setScore] = useState(0)
  const [details, setDetails] = useState('')
  const [matchScores, setMatchScores] = useState([])

  const { getMatchParticipants, addScoreToMatch, getMatchScores, removeScoreFromMatch, isLoading } =
    useApi()

  const fetchParticipants = async () => {
    const response = await getMatchParticipants(matchRecord.id)
    const formattedData = response.data.map((participant) => ({
      label: participant.team?.name || participant.player?.name,
      teamId: participant.teamId || null,
      playerId: participant.playerId || null,
      participantType: participant.participantType
    }))

    console.log(formattedData)

    if (response.requestSuccessful) {
      setParticipants(formattedData)

      return formattedData
    } else {
      toast.error(response.error)
    }
  }

  const fetchMatchScores = async () => {
    const resp = await getMatchScores(matchRecord.id)
    if (resp.requestSuccessful) {
      setMatchScores(resp.data)
    } else {
      toast.error(resp.error)
    }
  }

  useEffect(() => {
    fetchParticipants()
    fetchMatchScores()
  }, [])

  const handleScore = (buttonType) => {
    if (buttonType === 'remove' && score > 0) {
      setScore(score - 1)
    } else if (buttonType !== 'remove') {
      setScore(score + 1)
    }
  }

  const saveScore = async () => {
    const resp = await addScoreToMatch(
      matchRecord.id,
      selectedParticipant.participantType,
      selectedParticipant.teamId,
      selectedParticipant.playerId,
      Number(score),
      details
    )

    return resp.requestSuccessful ? fetchMatchScores() : toast.error(resp.error)
  }

  const removeScore = async (scoreId) => {
    const resp = await removeScoreFromMatch(matchRecord.id, scoreId)
    return resp.requestSuccessful ? fetchMatchScores() : toast.error(resp.error)
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

        <div className="flex flex-col gap-4">
          <div className="flex gap-8">
            <h1 className="text-3xl">
              Pontos: <span className="text-emerald-600 font-bold">{score}</span>{' '}
            </h1>
            <div className="flex gap-2">
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
              labelField="label"
              placeholder="Selecione"
              minCharacters={2}
              onLoad={fetchParticipants}
              value={selectedParticipant}
              onChange={setSelectedParticipant}
            />
          </div>

          <div className="flex flex-col gap-4 w-full">
            <label htmlFor="txtar">Detalhes</label>
            <textarea
              id="txtar"
              placeholder="..."
              className="p-2 border rounded-md focus:outline-none focus:ring-2"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>

          <Button onClick={saveScore} disabled={isLoading || !selectedParticipant}>
            <Plus />
            Adicionar
          </Button>
        </div>

        <div>
          <h1 className="font-bold">Pontos</h1>
          {isLoading ? (
            <div className="flex justify-center items-center w-full my-4">
              <Spinner />
            </div>
          ) : (
            <ScrollArea className="w-full h-48">
              {matchScores.map((score) => (
                <div
                  key={score.id}
                  className="border p-2 my-2 rounded flex justify-between items-center"
                >
                  <div className="flex flex-col justify-between items-start">
                    <p className="font-medium">
                      {score.participantType === 'team' ? score.team.name : score.player.name} -{' '}
                      <b>{score.score}</b> ponto(s)
                    </p>
                    <p>Detalhes: {score.details} </p>
                    <p>{score.id}</p>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                      removeScore(score.id)
                    }}
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

export default MatchScoreForm
