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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { sha256 } from '@/services/cryptoUtil'
import useApi from '@/services/useApi'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil, Plus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

function UserForm({ record, onClose }) {
  const [userRecord, setUserRecord] = useState(record)
  const [isOpen, setIsOpen] = useState(false)

  const { createUser, updateUser } = useApi()

  const isCreate = userRecord === undefined

  const formSchema = z
    .object({
      userName: z.string().min(3, 'O nome do usuário deve ter pelo menos 3 caracteres'),
      email: z.string().email('Email inválido'),
      firstName: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
      lastName: z.string().min(3, 'O sobrenome deve ter pelo menos 3 caracteres'),
      password: z.string().optional(),
      confirmPassword: z.string().optional()
    })
    .refine(
      (data) => {
        const isPasswordUnchanged = !isCreate && data.password === record.password
        const isPasswordEqual = data.password === data.confirmPassword

        return isPasswordUnchanged || isPasswordEqual
      },
      {
        path: ['confirmPassword', 'password'],
        message: 'As senhas não coincidem'
      }
    )
    .refine(
      (data) => {
        const isPasswordChanged = data.password.length > 0 || data.confirmPassword.length > 0
        const isPasswordWithMinimumLength =
          data.password.length >= 5 && data.confirmPassword.length >= 5

        return !isPasswordChanged || (isPasswordChanged && isPasswordWithMinimumLength)
      },
      {
        path: ['password', 'confirmPassword'],
        message: 'A senha deve ter pelo menos 5 caracteres'
      }
    )

  const handleSubmit = async (event) => {
    event.preventDefault()

    const isValid = await form.trigger()

    if (isValid) {
      form.handleSubmit(isCreate ? onSubmitCreate : onSubmitUpdate)()
    }
  }

  const sanitizePassword = async (user) => {
    if (user.password) {
      user.password = await sha256(user.password)
    } else {
      delete user.password
    }

    delete user.confirmPassword

    return user
  }

  const onSubmitCreate = async (values) => {
    const user = await sanitizePassword(values)
    const { userName, firstName, lastName, email, password } = user

    const response = await createUser(userName, firstName, lastName, email, password)

    if (response.requestSuccessful) {
      closeDialog()
      toast.success('Usuário criado com sucesso')
    } else {
      toast.error(response.error)
    }
  }

  const onSubmitUpdate = async (values) => {
    const user = await sanitizePassword(values)
    const { userName, firstName, lastName, email, password } = user

    const response = await updateUser(userRecord.id, userName, firstName, lastName, email, password)

    if (response.requestSuccessful) {
      closeDialog()
      toast.success('Usuário atualizado com sucesso')
    } else {
      toast.error(response.error)
    }
  }

  const closeDialog = () => {
    onClose?.()
    handleOpenChange(false)
  }

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: userRecord?.userName || '',
      firstName: userRecord?.firstName || '',
      lastName: userRecord?.lastName || '',
      email: userRecord?.email || '',
      password: '',
      confirmPassword: ''
    }
  })

  const handleOpenChange = (open) => {
    setIsOpen(open)
    if (!open) {
      form.reset()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {isCreate ? (
          <Button variant="outline" className="bg-emerald-600 hover:bg-emerald-700" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="outline" size="icon">
            <Pencil />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isCreate ? 'Criar ' : 'Editar '} Usuário</DialogTitle>
          <DialogDescription>Preencha os dados corretamente.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="flex flex-col gap-4 space-y-4">
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Usuário</FormLabel>
                  <FormControl>
                    {isCreate ? (
                      <Input placeholder="Nome do usuário" {...field} />
                    ) : (
                      <p className="text-gray-500">{userRecord.userName}</p>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    {isCreate ? (
                      <Input placeholder="Email" {...field} />
                    ) : (
                      <p className="text-gray-500">{userRecord.email}</p>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder={isCreate ? 'Nome' : userRecord.firstName} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sobrenome</FormLabel>
                  <FormControl>
                    <Input placeholder={isCreate ? 'Sobrenome' : userRecord.lastName} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Senha" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirme a senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Confirme a senha" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogTrigger asChild>
              <Button
                type="button"
                onClick={handleSubmit}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Salvar
              </Button>
            </DialogTrigger>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default UserForm
