'use client'
import OverlaySpinner from '@/components/common/OverlaySpinner'
import EventsForm from '@/components/EventsComponents/EventsForm'
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
  const [events, setEvents] = useState([])
  const [units, setUnits] = useState([])
  const [selectedUnit, setSelectedUnit] = useState(null)
  const { getUnits, getEventsByUnitId, deleteEventById, isLoading } = useApi()
  useEffect(() => {
    fetchUnits()
  }, [])

  useEffect(() => {
    fetchEvents()
    fetchUnits()
  }, [selectedUnit])

  const fetchEvents = async () => {
    if (!selectedUnit) {
      return
    }

    const response = await getEventsByUnitId(selectedUnit)
    if (response.requestSuccessful) {
      setEvents(response.data)
    } else {
      toast.error(response.error)
    }
  }

  const deleteEvent = async (id) => {
    if (!selectedUnit) return

    const response = await deleteEventById(id)

    if (response.requestSuccessful) {
      toast.success('Torneio deletado com sucesso!')
      await fetchEvents()
    } else {
      toast.error(response.error)
    }
  }

  const fetchUnits = async () => {
    const response = await getUnits()
    if (response.requestSuccessful) {
      setUnits(response.data)
    } else {
      toast.error(response.error)
    }
  }

  return (
    <div className="flex flex-col items-center self-center h-screen w-full p-12 gap-8">
      {isLoading && <OverlaySpinner />}
      <h1>Eventos</h1>

      <div className="flex flex-col gap-2">
        <Select
          onValueChange={(value) => {
            setSelectedUnit(value)
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione a Unidade correspondente" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Unidades</SelectLabel>
              {units.map((unit) => (
                <SelectItem key={unit.id} value={unit.id}>
                  {unit.name}
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
            {selectedUnit && (
              <TableHead>
                <EventsForm variant="create" unitId={selectedUnit} onClose={fetchEvents} />
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              {console.log(event)}
              <TableCell className="font-medium">{event.name}</TableCell>
              <TableCell className="font-medium">{formatDate(event.startDate)}</TableCell>
              <TableCell className="font-medium">{formatDate(event.endDate)}</TableCell>
              <TableCell className="font-medium">{formatDate(event.updatedAt, true)}</TableCell>
              <TableCell className="font-medium">{formatDate(event.updatedAt, true)}</TableCell>
              <TableCell className="font-medium space-x-2">
                <EventsForm
                  variant="edit"
                  record={event}
                  unitId={selectedUnit}
                  onClose={fetchEvents}
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
                        onClick={() => {
                          deleteEvent(event.id)
                        }}
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
