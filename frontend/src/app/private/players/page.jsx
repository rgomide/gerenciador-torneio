'use client'
import OverlaySpinner from '@/components/common/OverlaySpinner'
import SelectSearcher from '@/components/common/SelectSearcher'
import PlayersForm from '@/components/PlayerComponents/PlayerForm'
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
  const { getPlayersByUnitId, deletePlayerById, isLoading, getUnits } = useApi()
  const [players, setPlayers] = useState([])
  const [selectedUnit, setSelectedUnit] = useState(null)

  useEffect(() => {
    fetchPlayers()
  }, [selectedUnit])

  const fetchPlayers = async () => {
    if (!selectedUnit) {
      return
    }

    const response = await getPlayersByUnitId(selectedUnit.id)
    if (response.requestSuccessful) {
      setPlayers(response.data)
    } else {
      setPlayers([])
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

  const deletePlayer = async (id) => {
    const response = await deletePlayerById(id)

    if (response.requestSuccessful) {
      toast.success('Atleta deletado com sucesso!')
      await fetchPlayers()
    } else {
      toast.error(response.error)
    }
  }

  return (
    <div className="flex flex-col items-center self-center h-screen w-full p-12 gap-8">
      {isLoading && <OverlaySpinner />}
      <h1>Atletas</h1>

      <div className="flex flex-col gap-2 w-full sm:w-[500px]">
        <SelectSearcher
          onLoad={fetchUnits}
          labelField="name"
          onChange={setSelectedUnit}
          placeholder="Selecione a Unidade correspondente"
        />
      </div>

      <Table className="w-full">
        <TableCaption>Lista de jogadores cadastrados no sistema</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Data de registro</TableHead>
            <TableHead>Última atualização</TableHead>
            {selectedUnit && (
              <TableHead>
                <PlayersForm unitId={selectedUnit?.id} onClose={fetchPlayers} />
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((player) => (
            <TableRow key={player.id}>
              <TableCell className="font-medium">{player.name}</TableCell>
              <TableCell className="font-medium">{player.email}</TableCell>
              <TableCell className="font-medium">{player.phone}</TableCell>
              <TableCell className="font-medium">{formatDate(player.createdAt, true)}</TableCell>
              <TableCell className="font-medium">{formatDate(player.updatedAt, true)}</TableCell>
              <TableCell className="font-medium flex gap-4">
                <PlayersForm unitId={selectedUnit?.id} record={player} onClose={fetchPlayers} />

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash />
                      Excluir
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Deletar atleta?</DialogTitle>
                      <DialogDescription>
                        Você tem certeza que deseja deletar esse atleta?
                      </DialogDescription>
                    </DialogHeader>

                    <div className="flex gap-4">
                      <DialogTrigger asChild>
                        <Button className="bg-emerald-600 hover:bg-emerald-600">Cancelar</Button>
                      </DialogTrigger>
                      <DialogTrigger asChild>
                        <Button
                          type="submit"
                          onClick={() => deletePlayer(player.id)}
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

export default Page
