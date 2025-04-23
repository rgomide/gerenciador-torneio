'use client'
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
import { deleteSportById, getSports } from '@/services/apiService'
import { Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

function page() {
  const [sports, setSports] = useState([])

  useEffect(() => {
    fetchSports()
  }, [])

  const fetchSports = async () => {
    try {
      const data = await getSports()
      setSports(data)
    } catch (error) {
      console.error(`Erro ao obter esportes: ${error}`)
    }
  }

  const deleteSport = async (id) => {
    try {
      const resp = await deleteSportById(id)

      if (!resp || resp.error) {
        throw new Error(resp?.error || 'Erro ao deletar esporte')
      } else {
        toast.success('Esporte deletado com sucesso!')
        await fetchSports()
      }
    } catch (e) {
      console.error(`Erro ao deletar esporte: ${e}`)
      toast.error(e.message || 'Erro ao deletar esporte')
    }
  }

  return (
    <div className="flex flex-col items-center self-center h-screen w-full p-12 gap-8">
      <h1>Esportes</h1>

      <Table className="w-full">
        <TableCaption>Lista de esportes cadastrados no sistema</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>
              <SportsForm onClose={fetchSports} />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sports.map((sport) => (
            <TableRow key={sport.id}>
              <TableCell className="font-medium">{sport.name}</TableCell>
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
