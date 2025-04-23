'use client'
import Spinner from '@/components/common/Spinner'
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
import { useRouter } from 'next/navigation'
import { use, useEffect, useState } from 'react'

function page({ params }) {
  const router = useRouter()
  const { institutionId } = use(params)
  const [units, setUnits] = useState([])
  const { getUnitsByInstitutionId, isLoading } = useApi()

  useEffect(() => {
    fetchUnits()
  }, [])

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
      {isLoading && <Spinner />}
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
              <TableCell className="font-medium">{formatDate(unit.createdAt)}</TableCell>
              <TableCell className="font-medium">{formatDate(unit.updatedAt)}</TableCell>
              <TableCell className="font-medium">
                <UnitForm record={unit} institutionId={institutionId} onClose={fetchUnits} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Button variant="outline" onClick={router.back}>
        {' '}
        <ArrowLeft /> Voltar para Instituições{' '}
      </Button>
    </div>
  )
}

export default page
