'use client'
import OverlaySpinner from '@/components/common/OverlaySpinner'
import Tag from '@/components/common/Tag'
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
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

function Page() {
  const [requestLogs, setRequestLogs] = useState([])

  const { getRequestLogs, isLoading } = useApi()

  useEffect(() => {
    fetchRequestLogs()
  }, [])

  const fetchRequestLogs = async () => {
    const response = await getRequestLogs()
    if (response.requestSuccessful) {
      setRequestLogs(response.data)
    } else {
      toast.error(response.error)
    }
  }

  const getMethodColor = (method) => {
    switch (method.toLowerCase()) {
      case 'get':
        return 'blue'
      case 'post':
        return 'green'
      case 'put':
        return 'yellow'
      case 'delete':
        return 'red'
      default:
        return 'gray'
    }
  }

  const getStatusColor = (status) => {
    const statusCategory = Math.trunc(status / 100)

    switch (statusCategory) {
      case 2:
        return 'green'
      case 3:
        return 'blue'
      case 4:
        return 'red'
      case 5:
        return 'purple'
      default:
        return 'gray'
    }
  }

  return (
    <div className="flex flex-col items-center self-center h-screen w-full p-12 gap-8">
      {isLoading && <OverlaySpinner />}
      <h1>Logs de requisições</h1>

      <Table className="w-full">
        <TableCaption>Logs de requisições</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Usuário</TableHead>
            <TableHead>IP</TableHead>
            <TableHead>Método</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tempo de resposta (ms)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requestLogs.map((requestLog) => (
            <TableRow key={requestLog.id}>
              <TableCell className="font-medium">
                {formatDate(requestLog.createdAt, true)}
              </TableCell>
              <TableCell className="font-medium">{requestLog.userName}</TableCell>
              <TableCell className="font-medium">{requestLog.ip}</TableCell>
              <TableCell className="font-medium">
                <Tag label={requestLog.method} color={getMethodColor(requestLog.method)} />
              </TableCell>
              <TableCell className="font-medium">{requestLog.url}</TableCell>
              <TableCell className="font-medium">
                <Tag label={requestLog.status} color={getStatusColor(requestLog.status)} />
              </TableCell>
              <TableCell className="font-medium">{requestLog.responseTime}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default Page
