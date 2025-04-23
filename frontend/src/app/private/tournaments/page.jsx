'use client'
import OverlaySpinner from '@/components/common/OverlaySpinner'
import TournamentsForm from '@/components/TournamentsComponents/TournamentForm'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { formatDate } from '@/services/dateUtil'
import useApi from '@/services/useApi'
import { Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

function page() {
  const [tournaments, setTournaments] = useState([])
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)

  const { getEvents, getTournamentsByEventId, deleteTournamentById, isLoading } = useApi()

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    fetchTournaments()
  }, [selectedEvent])

  const fetchTournaments = async () => {
    if (!selectedEvent) {
      return
    }

    const response = await getTournamentsByEventId(selectedEvent)

    if (response.requestSuccessful) {
      setTournaments(response.data)
    } else {
      toast.error(response.error || 'Erro ao obter torneios')
    }
  }

  const deleteTournament = async (id) => {
    if (!selectedEvent) return

    const resp = await deleteTournamentById(id)

    if (resp.requestSuccessful) {
      toast.success('Torneio deletado com sucesso!')
      await fetchTournaments()
    } else {
      console.error(resp.error)
      toast.error(resp.error)
    }
  }

  const fetchEvents = async () => {
    const response = await getEvents()
    if (response.requestSuccessful) {
      setEvents(response.data)
    } else {
      toast.error(response.error)
    }
  }

  return (
    <div className="flex flex-col items-center self-center h-screen w-full p-12 gap-8">
      {isLoading && <OverlaySpinner />}
      <h1>Torneios</h1>

      <div className="flex flex-col gap-2">
        <Select
          onValueChange={(value) => {
            setSelectedEvent(value)
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione o Evento" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Eventos</SelectLabel>
              {events.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  {event.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Table className="w-full">
        <TableCaption>Lista de Torneios cadastradas no sistema</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Nome</TableHead>
            <TableHead>Esporte</TableHead>
            <TableHead>Data de início</TableHead>
            <TableHead>Previsão de término</TableHead>
            <TableHead>Data de registro</TableHead>
            <TableHead>Última atualização</TableHead>
            {selectedEvent && (
              <TableHead>
                <TournamentsForm
                  variant="create"
                  eventId={selectedEvent}
                  onClose={fetchTournaments}
                />
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tournaments.map((tournament) => (
            <TableRow key={tournament.id}>
              <TableCell className="font-medium">{tournament.name}</TableCell>
              <TableCell className="font-medium">{tournament.sport?.name}</TableCell>
              <TableCell className="font-medium">{formatDate(tournament.startDate)}</TableCell>
              <TableCell className="font-medium">{formatDate(tournament.endDate)}</TableCell>
              <TableCell className="font-medium">{formatDate(tournament.createdAt)}</TableCell>
              <TableCell className="font-medium">{formatDate(tournament.updatedAt)}</TableCell>
              <TableCell className="font-medium space-x-2">
                <TournamentsForm
                  variant="edit"
                  record={tournament}
                  eventId={selectedEvent}
                  onClose={fetchTournaments}
                />
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                      <Trash />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Deletar torneio?</DialogTitle>
                      <DialogDescription>
                        Você tem certeza que deseja deletar esse torneio?
                      </DialogDescription>
                    </DialogHeader>

                    <div className="flex gap-4">
                      <DialogTrigger asChild>
                        <Button className="bg-emerald-600 hover:bg-emerald-600">Cancelar</Button>
                      </DialogTrigger>
                      <DialogTrigger asChild>
                        <Button
                          type="submit"
                          onClick={() => deleteTournament(tournament.id)}
                          variant="destructive"
                        >
                          Deletar
                        </Button>
                      </DialogTrigger>
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default page
