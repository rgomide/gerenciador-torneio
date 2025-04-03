'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteCookie } from 'cookies-next'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Calendar, FileUser, Home, Landmark, ShieldHalf, Trophy, UserRoundX } from "lucide-react"

const items = [
  {
    title: "Início",
    url: "/private/dashboard",
    icon: Home,
  },
  {
    title: "Instituições",
    url: "/private/institutions",
    icon: Landmark,
  },
  {
    title: "Eventos",
    url: "/private/events",
    icon: Calendar,
  },
  {
    title: "Torneios",
    url: "/private/tournaments",
    icon: Trophy,
  },
  {
    title: "Equipes",
    url: "/private/teams",
    icon: ShieldHalf,
  },
  {
    title: "Jogadores",
    url: "/private/players",
    icon: FileUser,
  },
]

export function AppSidebar() {
  const router = useRouter()

  const deleteSession = () => {
    deleteCookie("token", { path: "/" });
    toast.success("Sessão deletada com sucesso!")
    router.replace('/')
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Gerenciador de torneios</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <AlertDialog>
          <AlertDialogTrigger className='bg-red-500 text-white rounded-sm py-1 flex items-center justify-center gap-2 cursor-pointer'>
            Sair
            <UserRoundX size={16} />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Você realmente deseja sair?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={deleteSession} className={'bg-red-500 hover:bg-red-700'}>Sair</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarFooter>
    </Sidebar>
  )
}
