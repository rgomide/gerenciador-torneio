'use client'
import OverlaySpinner from '@/components/common/OverlaySpinner'
import SelectSearcher from '@/components/common/SelectSearcher'
import AddPlayerForm from '@/components/TeamsComponents/AddPlayerForm'
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

function Page() {
  const { getUnits, deleteTeamById, getTeamsByUnitId, isLoading } = useApi()
  const [teams, setTeams] = useState([])
  const [selectedUnit, setSelectedUnit] = useState(null)

  useEffect(() => {
    fetchTeams()
  }, [selectedUnit])

  const fetchTeams = async () => {
    if (!selectedUnit) {
      return
    }

    const response = await getTeamsByUnitId(selectedUnit.id)
    if (response.requestSuccessful) {
      setTeams(response.data)
    } else {
      setTeams([])
      toast.error(response.error)
    }
  }

  const deleteTeam = async (id) => {
    if (!selectedUnit) return

    const response = await deleteTeamById(id)

    if (response.requestSuccessful) {
      toast.success('Equipe deletado com sucesso!')
      await fetchTeams()
    } else {
      toast.error(response.error)
    }
  }

  const fetchUnits = async (searchTerm) => {
    const response = await getUnits({ name: searchTerm })

    if (response.requestSuccessful) {
      return response.data
    } else {
      toast.error(response.error)
      return []
    }
  }

  return (
    <div className="flex flex-col items-center self-center h-screen w-full p-12 gap-8">
      {isLoading && <OverlaySpinner />}
      <h1>Equipes</h1>

      <div className="flex flex-col gap-2 w-full sm:w-[500px]">
        <SelectSearcher
          onLoad={fetchUnits}
          labelField="name"
          onChange={setSelectedUnit}
          placeholder="Selecione a Unidade correspondente"
        />
      </div>

      <Table className="w-full">
        <TableCaption>Lista de Eventos cadastradas no sistema</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Nome</TableHead>
            <TableHead>Esporte</TableHead>
            <TableHead>Data de registro</TableHead>
            <TableHead>Última atualização</TableHead>
            {selectedUnit && (
              <TableHead>
                <TeamsForm unit={selectedUnit} onClose={fetchTeams} />
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams.map((team) => (
            <TableRow key={team.id}>
              <TableCell className="font-medium">{team.name}</TableCell>
              <TableCell className="font-medium">{team.sport?.name}</TableCell>
              <TableCell className="font-medium">{formatDate(team.createdAt, true)}</TableCell>
              <TableCell className="font-medium">{formatDate(team.updatedAt, true)}</TableCell>
              <TableCell className="font-medium space-x-2">
                <TeamsForm variant="edit" record={team} onClose={fetchTeams} />

                <AddPlayerForm team={team} unitId={selectedUnit.id} />

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash />
                      Excluir
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

export default Page
