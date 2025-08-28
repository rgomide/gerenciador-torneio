'use client'

import useApi from '@/services/useApi'
import { DialogDescription } from '@radix-ui/react-dialog'
import { FileUser } from 'lucide-react'
import { useEffect, useState } from 'react'
import Spinner from '../common/Spinner'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'

function ParticipantsForm({ record: matchRecord }) {
  const [participants, setParticipants] = useState([])
  const { getMatchParticipants, isLoading } = useApi()

  useEffect(() => {
    const fetchParticipants = async () => {
      const response = await getMatchParticipants(matchRecord.id)

      if (response.requestSuccessful) {
        setParticipants(response.data)
      } else {
        toast.error(response.error)
      }
    }

    fetchParticipants()
  }, [])

  return (
    <Dialog>
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

        <div>
          <h1 className="font-bold">Lista de participantes</h1>
          {isLoading ? (
            <div className="flex justify-center items-center w-full my-4">
              <Spinner />
            </div>
          ) : (
            participants.map((participant) => (
              <div key={participant.id} className="border p-2 my-2 rounded">
                <p className="font-medium">
                  {participant.participantType === 'team'
                    ? participant.team?.name
                    : participant.player?.name}
                </p>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ParticipantsForm
