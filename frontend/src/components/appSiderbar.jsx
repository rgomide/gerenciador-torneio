'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Separator } from '@/components/ui/separator'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import useCookies from '@/services/useCookies'
import {
  Calendar,
  FileUser,
  Home,
  Landmark,
  Logs,
  ShieldHalf,
  Trophy,
  UserRoundX,
  Users,
  Volleyball
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const menuItems = [
  {
    title: 'Início',
    url: '/private/dashboard',
    icon: Home,
    admin: false
  },
  {
    title: 'Instituições e Unidades',
    url: '/private/institutions',
    icon: Landmark,
    admin: false
  },
  {
    title: 'Eventos',
    url: '/private/events',
    icon: Calendar,
    admin: false
  },
  {
    title: 'Torneios',
    url: '/private/tournaments',
    icon: Trophy,
    admin: false
  },
  {
    title: 'Equipes',
    url: '/private/teams',
    icon: ShieldHalf,
    admin: false
  },
  {
    title: 'Jogadores',
    url: '/private/players',
    icon: FileUser,
    admin: false
  },
  {
    title: 'Esportes',
    url: '/private/sports',
    icon: Volleyball,
    admin: false
  },
  {
    title: 'Usuários',
    url: '/private/users',
    icon: Users,
    admin: true,
    addSeparator: true
  },
  {
    title: 'Logs de requisições',
    url: '/private/request-logs',
    icon: Logs,
    admin: true
  }
]

export function AppSidebar() {
  const navigate = useNavigate()
  const [userItems, setUserItems] = useState([])
  const [user, setUser] = useState(null)

  const { getAuthCookie, deleteAuthCookie } = useCookies()

  useEffect(() => {
    const { user } = getAuthCookie() ?? {}
    setUser(user)
  }, [])

  useEffect(() => {
    if (user) {
      const filteredItems = menuItems.filter((item) => {
        const validateAdminRule = item.admin && user.isAdmin
        const validateAnyUser = !item.admin

        return validateAdminRule || validateAnyUser
      })

      setUserItems(filteredItems)
    }
  }, [user])

  const deleteSession = () => {
    deleteAuthCookie()
    toast.success('Sessão deletada com sucesso!')
    navigate('/', { replace: true })
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Gerenciador de torneios</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.addSeparator && <Separator />}
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <AlertDialog>
          <AlertDialogTrigger className="bg-red-500 text-white rounded-sm py-1 flex items-center justify-center gap-2 cursor-pointer">
            Sair
            <UserRoundX size={16} />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>Você realmente deseja sair?</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={deleteSession} className={'bg-red-500 hover:bg-red-700'}>
                Sair
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarFooter>
    </Sidebar>
  )
}
