'use client'
import OverlaySpinner from '@/components/common/OverlaySpinner'
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
import UnitForm from '@/components/unitsComponents/UnitForm'
import { formatDate } from '@/services/dateUtil'
import useApi from '@/services/useApi'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

function Page() {
  const [units, setUnits] = useState([])

  const navigate = useNavigate()
  const { institutionId } = useParams()
  const { getUnitsByInstitutionId, isLoading } = useApi()

  useEffect(() => {
    fetchUnits()
  }, [institutionId])

  const fetchUnits = async () => {
    const response = await getUnitsByInstitutionId(institutionId)
    if (response.requestSuccessful) {
      setUnits(response.data)
    } else {
      toast.error(response.error)
    }
  }

  return (
    <div className="flex flex-col items-center self-center h-screen w-full p-12 gap-8">
      {isLoading && <OverlaySpinner />}
      <h1>Unidades</h1>

      <Table className="w-full">
        <TableCaption>Lista das unidades cadastradas no sistema</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Nome</TableHead>
            <TableHead>Data de registro</TableHead>
            <TableHead>Última atualização</TableHead>
            <TableHead>
              <UnitForm onClose={fetchUnits} institutionId={institutionId} />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {units.map((unit) => (
            <TableRow key={unit.id}>
              <TableCell className="font-medium">{unit.name}</TableCell>
              <TableCell className="font-medium">{formatDate(unit.createdAt, true)}</TableCell>
              <TableCell className="font-medium">{formatDate(unit.updatedAt, true)}</TableCell>
              <TableCell className="font-medium">
                <UnitForm record={unit} institutionId={institutionId} onClose={fetchUnits} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Button variant="outline" onClick={() => navigate(-1)}>
        {' '}
        <ArrowLeft /> Voltar para Instituições{' '}
      </Button>
    </div>
  )
}

export default Page
