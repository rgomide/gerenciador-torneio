'use client'
import React from 'react'
import { formatDate, getInstitutions } from '@/services/apiService';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import CreateInstitution from '@/components/InstitutionsComponents/CreateInstitution';
import UpdateInstitution from '@/components/InstitutionsComponents/UpdateInstitution';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SquareArrowUpRight } from 'lucide-react';


function page() {
  const [institutions, setInstitutions] = React.useState([])

  React.useEffect(() => {
    fetchInstitutions()
  }, [])

  const fetchInstitutions = async () => {
    try {
      const data = await getInstitutions()
      setInstitutions(data)
    } catch (e) {
      console.error(`Erro ao obter instituições: ${e}`);
    }
  }

  return (
    <div className='flex flex-col items-center self-center h-screen w-full p-12 gap-8'>
      <h1>Instituições</h1>

      <Table className='w-full'>
        <TableCaption>Lista de Instituições cadastradas no sistema</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Nome</TableHead>
            <TableHead>Data de registro</TableHead>
            <TableHead>Última atualização</TableHead>
            <TableHead>Unidades</TableHead>
            <TableHead>
              <CreateInstitution fetchFunction={fetchInstitutions} />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {institutions.map((institution) => (
            <TableRow key={institution.id}>
              <TableCell className="font-medium">{institution.name}</TableCell>
              <TableCell className="font-medium">{formatDate(institution.createdAt)}</TableCell>
              <TableCell className="font-medium">{formatDate(institution.updatedAt)}</TableCell>
              <TableCell className="font-medium">
                <Link href={`./units/${institution.id}`}>
                  <Button variant='outline' size='icon'>
                    <SquareArrowUpRight/>
                  </Button>
                </Link>
              </TableCell>
              <TableCell className="font-medium">
                <UpdateInstitution fetchFunction={fetchInstitutions} prevName={institution.name} id={institution.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default page