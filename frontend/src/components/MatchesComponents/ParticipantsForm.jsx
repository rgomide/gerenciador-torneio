'use client'

import { FileUser } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { DialogDescription } from "@radix-ui/react-dialog"
import { useEffect, useState } from "react"
import useApi from "@/services/useApi"

function ParticipantsForm({ matchId, record }) {
  const [participants, setParticipants] = useState([])
  const { getMatchParticipants } = useApi()
  console.log(matchId);


  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const data = await getMatchParticipants(matchId)
        console.log(data);
        
        setParticipants(data)
      } catch (e) {
        console.error(e);
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
          <DialogDescription>
            Adicionar participantes à partida.
          </DialogDescription>
        </DialogHeader>

        <div>
          <h1 className='font-bold'>Lista de participantes</h1>

          {participants.map((participant) => (
            <div key={participant.id} className='border p-2 my-2 rounded'>
              <p className='font-medium'>
                {participant.participantType === "team"
                  ? participant.team?.name
                  : participant.player?.name}
              </p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ParticipantsForm
