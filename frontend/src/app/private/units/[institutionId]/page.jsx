'use client'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import CreateUnit from '@/components/unitsComponents/CreateUnit'
import UpdateUnit from '@/components/unitsComponents/UpdateUnit'
import { formatDate, getUnitsByInstitutionId } from '@/services/apiService'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

function page({ params }) {
  const router = useRouter()
  const { institutionId } = React.use(params)
  const [units, setUnits] = React.useState([])

  React.useEffect(() => {
    fetchUnits()
  }, [])

  const fetchUnits = async () => {
    const data = await getUnitsByInstitutionId(institutionId)
    setUnits(data)
  }

  return (
    <div className='flex flex-col items-center self-center h-screen w-full p-12 gap-8'>
      <h1>Unidades</h1>

      <Table className='w-full'>
        <TableCaption>Lista das unidades cadastradas no sistema</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Nome</TableHead>
            <TableHead>Data de registro</TableHead>
            <TableHead>Última atualização</TableHead>
            <TableHead>
              <CreateUnit fetchFunction={fetchUnits} institutionId={institutionId} />
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
                <UpdateUnit fetchFunction={fetchUnits} prevName={unit.name} id={unit.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Button variant='outline' onClick={router.back}> <ArrowLeft/> Voltar para Instituições </Button>
    </div>
  )
}

export default page