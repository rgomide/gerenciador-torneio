'use client'
import OverlaySpinner from '@/components/common/OverlaySpinner'
import InstitutionForm from '@/components/InstitutionsComponents/InstitutionForm'
import { Button } from '@/components/ui/button'
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
import { SquareArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
function Page() {
  const { getInstitutions, isLoading } = useApi()
  const [institutions, setInstitutions] = useState([])

  useEffect(() => {
    fetchInstitutions()
  }, [])

  const fetchInstitutions = async () => {
    try {
      const response = await getInstitutions()
      setInstitutions(response.data)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="flex flex-col items-center self-center h-screen w-full p-12 gap-8">
      {isLoading && <OverlaySpinner />}
      <h1>Instituições</h1>

      <Table className="w-full">
        <TableCaption>Lista de Instituições cadastradas no sistema</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Nome</TableHead>
            <TableHead>Data de registro</TableHead>
            <TableHead>Última atualização</TableHead>
            <TableHead>
              <InstitutionForm onClose={fetchInstitutions} />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {institutions.map((institution) => (
            <TableRow key={institution.id}>
              <TableCell className="font-medium">{institution.name}</TableCell>
              <TableCell className="font-medium">
                {formatDate(institution.createdAt, true)}
              </TableCell>
              <TableCell className="font-medium">
                {formatDate(institution.updatedAt, true)}
              </TableCell>
              <TableCell className="font-medium flex gap-2">
                <Link to={`/private/units/${institution.id}`}>
                  <Button variant="outline">
                    <SquareArrowUpRight />
                    Ver unidades
                  </Button>
                </Link>
                <InstitutionForm record={institution} onClose={fetchInstitutions} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default Page
