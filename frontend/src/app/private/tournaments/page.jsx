'use client'
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
import { formatDate, getEvents, getTournamentsByEventId } from '@/services/apiService'
import { Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

function page() {
  const [tournaments, setTournaments] = useState([])
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    fetchEvents()
    fetchTournaments()
  }, [selectedEvent])

  const fetchTournaments = async () => {
    if (!selectedEvent) {
      return
    }

    try {
      const data = await getTournamentsByEventId(selectedEvent)
      setTournaments(data)
    } catch (e) {
      console.error(`Erro ao obter instituições: ${e}`)
    }
  }

  const deleteTournament = async (id) => {
    if (!selectedEvent) return

    try {
      await deleteTournamentById(id)
      toast.success('Torneio deletado com sucesso!')

      fetchEvents()
    } catch (e) {
      console.error(`Erro ao deletar torneio: ${e}`)
      toast.error('Erro ao deletar torneio.')
    }
  }

  const fetchEvents = async () => {
    try {
      const data = await getEvents()
      setEvents(data)
    } catch (e) {
      console.error(`Erro ao obter eventos: ${e}`)
    }
  }

  return (
    <div className="flex flex-col items-center self-center h-screen w-full p-12 gap-8">
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
        <TableCaption>Lista de Eventos cadastradas no sistema</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Nome</TableHead>
            <TableHead>Data de início</TableHead>
            <TableHead>Previsão de término</TableHead>
            <TableHead>Data de registro</TableHead>
            <TableHead>Última atualização</TableHead>
            <TableHead>
              <TournamentsForm
                variant="create"
                eventId={selectedEvent}
                onClose={fetchTournaments}
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tournaments.map((tournament) => (
            <TableRow key={tournament.id}>
              <TableCell className="font-medium">{tournament.name}</TableCell>
              <TableCell className="font-medium">{formatDate(tournament.startDate)}</TableCell>
              <TableCell className="font-medium">{formatDate(tournament.endDate)}</TableCell>
              <TableCell className="font-medium">{formatDate(tournament.updatedAt)}</TableCell>
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
                      <DialogTitle>Deletar evento?</DialogTitle>
                      <DialogDescription>
                        Você tem certeza que deseja deletar esse evento?
                      </DialogDescription>
                    </DialogHeader>

                    <div className="flex gap-4">
                      <DialogTrigger asChild>
                        <Button className="bg-emerald-600 hover:bg-emerald-600">Cancelar</Button>
                      </DialogTrigger>
                      <Button
                        type="submit"
                        onClick={() => deleteEvent(event.id)}
                        variant="destructive"
                      >
                        Deletar
                      </Button>
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
