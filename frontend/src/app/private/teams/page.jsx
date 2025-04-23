'use client'
import SelectSearcher from '@/components/common/SelectSearcher'
import EventsForm from '@/components/EventsComponents/EventsForm'
import TeamsForm from '@/components/TeamsComponents/TeamsForm'
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
import { deleteEventById, deleteTeamById, formatDate, getEventsByUnitId, getTeamsByUnitId, getUnits } from '@/services/apiService'
import { Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

function page() {
  const [teams, setTeams] = useState([])
  const [selectedUnit, setSelectedUnit] = useState(null)

  useEffect(() => {
    fetchTeams()
  }, [selectedUnit])

  const fetchTeams = async () => {
    if (!selectedUnit) {
      return
    }

    try {
      const data = await getTeamsByUnitId(selectedUnit.id)
      setTeams(data)
    } catch (e) {
      console.error(`Erro ao obter times: ${e}`)
    }
  }

  const deleteTeam = async (id) => {
    if (!selectedUnit) return

    try {
      const resp = await deleteTeamById(id)

      if (!resp || resp.error) {
        throw new Error(resp?.error || 'Erro ao deletar equipe')
      } else {
        toast.success('Equipe deletado com sucesso!')
        await fetchTeams()
      }
    } catch (e) {
      console.error(`Erro ao deletar equipe: ${e}`)
      toast.error(e.message || 'Erro ao deletar equipe')
    }
  }

  const fetchUnits = async (searchTerm) => {
    try {
      const data = await getUnits({ name: searchTerm })
      return data
    } catch (e) {
      console.error(`Erro ao obter instituições: ${e}`)
      return []
    }
  }

  return (
    <div className="flex flex-col items-center self-center h-screen w-full p-12 gap-8">
      <h1>Equipes</h1>

      <div className="flex flex-col gap-2">
        <SelectSearcher onLoad={fetchUnits} labelField='name' onChange={setSelectedUnit} placeholder="Selecione a Unidade correspondente" />
      </div>

      <Table className="w-full">
        <TableCaption>Lista de Eventos cadastradas no sistema</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Nome</TableHead>
            <TableHead>Data de registro</TableHead>
            <TableHead>Última atualização</TableHead>
            {selectedUnit && (
              <TableHead>
                <TeamsForm unitId={selectedUnit.id} onClose={fetchTeams} />
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams.map((team) => (
            <TableRow key={team.id}>
              <TableCell className="font-medium">{team.name}</TableCell>
              <TableCell className="font-medium">{formatDate(team.updatedAt)}</TableCell>
              <TableCell className="font-medium">{formatDate(team.updatedAt)}</TableCell>
              <TableCell className="font-medium space-x-2">
                <TeamsForm
                  variant="edit"
                  record={team}
                  unitId={selectedUnit}
                  onClose={fetchTeams}
                />
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                      <Trash />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Deletar equipe?</DialogTitle>
                      <DialogDescription>
                        Você tem certeza que deseja deletar essa equipe?
                      </DialogDescription>
                    </DialogHeader>

                    <div className="flex gap-4">
                      <DialogTrigger asChild>
                        <Button className="bg-emerald-600 hover:bg-emerald-600">Cancelar</Button>
                      </DialogTrigger>
                      <Button
                        type="submit"
                        onClick={() => {
                          deleteTeam(team.id)
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
