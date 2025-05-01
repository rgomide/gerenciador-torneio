'use client'
import OverlaySpinner from '@/components/common/OverlaySpinner'
import SportsForm from '@/components/SportsComponents/SportsForm'
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

function page() {
  const { getSports, deleteSportById, isLoading } = useApi()
  const [sports, setSports] = useState([])

  useEffect(() => {
    fetchSports()
  }, [])

  const fetchSports = async () => {
    const response = await getSports()
    if (response.requestSuccessful) {
      setSports(response.data)
    } else {
      toast.error(response.error)
    }
  }

  const deleteSport = async (id) => {
    const response = await deleteSportById(id)

    if (response.requestSuccessful) {
      toast.success('Esporte deletado com sucesso!')
      await fetchSports()
    } else {
      toast.error(response.error)
    }
  }

  return (
    <div className="flex flex-col items-center self-center h-screen w-full p-12 gap-8">
      {isLoading && <OverlaySpinner />}
      <h1>Esportes</h1>

      <Table className="w-full">
        <TableCaption>Lista de esportes cadastrados no sistema</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Data de registro</TableHead>
            <TableHead>Última atualização</TableHead>
            <TableHead>
              <SportsForm onClose={fetchSports} />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sports.map((sport) => (
            <TableRow key={sport.id}>
              <TableCell className="font-medium">{sport.name}</TableCell>
              <TableCell className="font-medium">{formatDate(sport.createdAt, true)}</TableCell>
              <TableCell className="font-medium">{formatDate(sport.updatedAt, true)}</TableCell>
              <TableCell className="font-medium flex gap-4">
                <SportsForm record={sport} onClose={fetchSports} />

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                      <Trash />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Deletar esporte?</DialogTitle>
                      <DialogDescription>
                        Você tem certeza que deseja deletar esse esporte?
                      </DialogDescription>
                    </DialogHeader>

                    <div className="flex gap-4">
                      <DialogTrigger asChild>
                        <Button className="bg-emerald-600 hover:bg-emerald-600">Cancelar</Button>
                      </DialogTrigger>
                      <DialogTrigger asChild>
                        <Button
                          type="submit"
                          onClick={() => deleteSport(sport.id)}
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
