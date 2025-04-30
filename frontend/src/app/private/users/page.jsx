'use client'
import UserForm from '@/components/UsersComponents/UserForm'
import OverlaySpinner from '@/components/common/OverlaySpinner'
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
  const { getUsers, deleteUserById, isLoading } = useApi()
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    const response = await getUsers()

    if (response.requestSuccessful) {
      setUsers(response.data)
    } else {
      toast.error(response.error)
    }
  }

  const deleteUser = async (id) => {
    const response = await deleteUserById(id)

    if (response.requestSuccessful) {
      toast.success('Usuário deletado com sucesso')
      fetchUsers()
    } else {
      toast.error(response.error)
    }
  }

  return (
    <div className="flex flex-col items-center self-center h-screen w-full p-12 gap-8">
      {isLoading && <OverlaySpinner />}
      <h1>Usuários</h1>

      <Table className="w-full">
        <TableCaption>Lista de Usuários cadastrados no sistema</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Usuário</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Data de registro</TableHead>
            <TableHead>Última atualização</TableHead>
            <TableHead>
              <UserForm onClose={fetchUsers} />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.userName}</TableCell>
              <TableCell className="font-medium">
                {user.firstName} {user.lastName}
              </TableCell>
              <TableCell className="font-medium">{user.email}</TableCell>
              <TableCell className="font-medium">{formatDate(user.createdAt)}</TableCell>
              <TableCell className="font-medium">{formatDate(user.updatedAt)}</TableCell>
              <TableCell className="font-medium">
                <UserForm record={user} onClose={fetchUsers} />

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                      <Trash />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Deletar usuário?</DialogTitle>
                      <DialogDescription>
                        Você tem certeza que deseja deletar esse usuário?
                      </DialogDescription>
                    </DialogHeader>

                    <div className="flex gap-4">
                      <DialogTrigger asChild>
                        <Button className="bg-emerald-600 hover:bg-emerald-600">Cancelar</Button>
                      </DialogTrigger>
                      <DialogTrigger asChild>
                        <Button
                          type="submit"
                          onClick={() => deleteUser(user.id)}
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
