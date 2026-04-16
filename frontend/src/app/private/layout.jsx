'use client'

import { AppSidebar } from '@/components/appSiderbar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Outlet } from 'react-router-dom'

export default function PrivateLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-fit overflow-hidden">
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  )
}
